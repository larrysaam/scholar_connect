import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Comprehensive Email System Testing Suite
 * Use this to verify all email functionality is working correctly
 */

export interface EmailTestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
}

export class EmailSystemTester {
  private toast: any;
  private results: EmailTestResult[] = [];

  constructor() {
    this.toast = useToast().toast;
  }

  /**
   * Run all email tests
   */
  async runAllTests(): Promise<EmailTestResult[]> {
    this.results = [];
    
    console.log('🧪 Starting Email System Tests...');
    
    await this.testEmailLogs();
    await this.testEmailTemplates();
    await this.testNotificationTriggers();
    await this.testUserPreferences();
    await this.testEdgeFunctions();
    await this.testCronFunction();
    
    console.log('✅ Email System Tests Completed');
    this.displayResults();
    
    return this.results;
  }

  /**
   * Test email logs table functionality
   */
  async testEmailLogs(): Promise<void> {
    try {
      // Test email logs table access
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .limit(5);

      if (error) {
        this.addResult('Email Logs Table', false, `Database error: ${error.message}`);
        return;
      }

      this.addResult('Email Logs Table', true, `Found ${data?.length || 0} recent email logs`);
      
      // Test email log insertion
      const testLog = {
        user_id: null,
        email: 'test@example.com',
        subject: 'Test Email Log',
        notification_type: 'test',
        template_used: 'generic',
        sent_at: new Date().toISOString(),
        metadata: { test: true }
      };

      const { error: insertError } = await supabase
        .from('email_logs')
        .insert(testLog);

      if (insertError) {
        this.addResult('Email Log Insertion', false, `Insert error: ${insertError.message}`);
      } else {
        this.addResult('Email Log Insertion', true, 'Successfully inserted test email log');
      }
    } catch (error: any) {
      this.addResult('Email Logs Table', false, `Test error: ${error.message}`);
    }
  }

  /**
   * Test email template functionality
   */
  async testEmailTemplates(): Promise<void> {
    const templates = [
      'consultation_confirmed',
      'payment_received', 
      'job_application_accepted',
      'coauthor_invitation',
      'booking_reminder',
      'generic'
    ];

    for (const template of templates) {
      await this.testEmailTemplate(template);
    }
  }

  /**
   * Test individual email template
   */
  async testEmailTemplate(templateName: string): Promise<void> {
    try {
      const testData = this.getTestDataForTemplate(templateName);
      
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          to: 'test@example.com',
          templateName,
          templateData: testData,
          dryRun: true // Don't actually send email, just test template rendering
        }
      });

      if (error) {
        this.addResult(`Template: ${templateName}`, false, `Template error: ${error.message}`);
      } else {
        this.addResult(`Template: ${templateName}`, true, 'Template rendered successfully');
      }
    } catch (error: any) {
      this.addResult(`Template: ${templateName}`, false, `Test error: ${error.message}`);
    }
  }

  /**
   * Test notification triggers
   */
  async testNotificationTriggers(): Promise<void> {
    try {
      // Test if notification triggers exist
      const { data, error } = await supabase
        .rpc('check_notification_triggers');

      if (error) {
        this.addResult('Notification Triggers', false, `Trigger check error: ${error.message}`);
      } else {
        this.addResult('Notification Triggers', true, 'Notification triggers are active');
      }
    } catch (error: any) {
      // If the RPC doesn't exist, check manually
      try {
        const { data: triggerData, error: triggerError } = await supabase
          .from('pg_trigger')
          .select('tgname')
          .like('tgname', '%email%');

        if (triggerError) {
          this.addResult('Notification Triggers', false, `Manual check error: ${triggerError.message}`);
        } else {
          this.addResult('Notification Triggers', true, `Found ${triggerData?.length || 0} email-related triggers`);
        }
      } catch (manualError: any) {
        this.addResult('Notification Triggers', false, `Unable to check triggers: ${manualError.message}`);
      }
    }
  }

  /**
   * Test user preferences functionality
   */
  async testUserPreferences(): Promise<void> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        this.addResult('User Preferences', false, 'User not authenticated');
        return;
      }

      // Test fetching user preferences
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('notification_preferences')
        .eq('id', user.id)
        .single();

      if (profileError) {
        this.addResult('User Preferences', false, `Profile fetch error: ${profileError.message}`);
        return;
      }

      const preferences = userProfile?.notification_preferences || {};
      const hasEmailPrefs = Object.keys(preferences).some(key => key.includes('email'));

      this.addResult('User Preferences', true, 
        `Preferences loaded. Email notifications: ${hasEmailPrefs ? 'configured' : 'default'}`);
        
    } catch (error: any) {
      this.addResult('User Preferences', false, `Test error: ${error.message}`);
    }
  }

  /**
   * Test edge functions connectivity
   */
  async testEdgeFunctions(): Promise<void> {
    try {
      // Test send-email-notification function
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          test: true,
          checkConnection: true
        }
      });

      if (error) {
        this.addResult('Edge Function: send-email-notification', false, 
          `Function error: ${error.message}`);
      } else {
        this.addResult('Edge Function: send-email-notification', true, 
          'Function is accessible and responding');
      }
    } catch (error: any) {
      this.addResult('Edge Function: send-email-notification', false, 
        `Connection error: ${error.message}`);
    }
  }

  /**
   * Test cron function
   */
  async testCronFunction(): Promise<void> {
    try {
      // Test booking-reminder-cron function
      const { data, error } = await supabase.functions.invoke('booking-reminder-cron', {
        body: {
          test: true,
          dryRun: true
        }
      });

      if (error) {
        this.addResult('Cron Function: booking-reminder-cron', false, 
          `Function error: ${error.message}`);
      } else {
        this.addResult('Cron Function: booking-reminder-cron', true, 
          'Function is accessible and responding');
      }
    } catch (error: any) {
      this.addResult('Cron Function: booking-reminder-cron', false, 
        `Connection error: ${error.message}`);
    }
  }

  /**
   * Add test result
   */
  private addResult(test: string, success: boolean, message: string, data?: any): void {
    this.results.push({ test, success, message, data });
    
    const emoji = success ? '✅' : '❌';
    console.log(`${emoji} ${test}: ${message}`);
  }

  /**
   * Display final test results
   */
  private displayResults(): void {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`   • ${r.test}: ${r.message}`));
    }

    // Show toast notification
    this.toast({
      title: "Email System Test Results",
      description: `${passedTests}/${totalTests} tests passed (${((passedTests / totalTests) * 100).toFixed(1)}%)`,
      variant: failedTests > 0 ? "destructive" : "default"
    });
  }

  /**
   * Get test data for email templates
   */
  private getTestDataForTemplate(templateName: string): any {
    const baseData = {
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      dashboardUrl: 'https://ResearchTandem.com/dashboard'
    };

    switch (templateName) {
      case 'consultation_confirmed':
        return {
          ...baseData,
          date: '2024-01-15',
          time: '14:00',
          researcherName: 'Dr. Jane Smith',
          serviceName: 'Research Methodology Consultation',
          meetingLink: 'https://meet.google.com/abc-defg-hij'
        };

      case 'payment_received':
        return {
          ...baseData,
          amount: 50000,
          currency: 'XAF',
          transactionId: 'TXN123456789',
          date: new Date().toISOString(),
          serviceName: 'Research Consultation'
        };

      case 'job_application_accepted':
        return {
          ...baseData,
          jobTitle: 'Research Paper Writing Assistant',
          clientName: 'Dr. John Client',
          budget: 100000,
          currency: 'XAF',
          startDate: '2024-01-20'
        };

      case 'coauthor_invitation':
        return {
          ...baseData,
          projectTitle: 'AI in Education Research',
          projectDescription: 'A comprehensive study on AI applications in educational settings',
          inviterName: 'Dr. Alice Researcher',
          role: 'Co-Author',
          acceptUrl: 'https://ResearchTandem.com/collaborations/accept/123'
        };

      case 'booking_reminder':
        return {
          ...baseData,
          date: '2024-01-15',
          time: '14:00',
          timeUntil: '24 hours',
          researcherName: 'Dr. Jane Smith',
          serviceName: 'Research Methodology Consultation',
          meetingLink: 'https://meet.google.com/abc-defg-hij'
        };

      case 'generic':
        return {
          ...baseData,
          subject: 'Test Generic Email',
          title: 'System Test Notification',
          content: 'This is a test email to verify the generic template functionality.',
          actionUrl: 'https://ResearchTandem.com/dashboard',
          actionLabel: 'Go to Dashboard'
        };

      default:
        return baseData;
    }
  }
}

// React component for testing email system in UI
export const EmailSystemTestPanel: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<EmailTestResult[]>([]);
  const { toast } = useToast();

  const runTests = async () => {
    setTesting(true);
    const tester = new EmailSystemTester();
    const testResults = await tester.runAllTests();
    setResults(testResults);
    setTesting(false);
  };

 
};

// Export individual test functions for specific testing
export const emailSystemTester = new EmailSystemTester();
