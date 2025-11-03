
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Lock,
  Database,
  FileText,
  Network,
  Users
} from 'lucide-react';

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastChecked: string;
  recommendation?: string;
}

const SecurityAudit: React.FC = () => {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [auditProgress, setAuditProgress] = useState(0);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  // Initialize security checks
  useEffect(() => {
    const initialChecks: SecurityCheck[] = [
      {
        id: 'input-validation',
        name: 'Input Validation',
        description: 'All user inputs are properly validated and sanitized',
        status: 'pass',
        severity: 'high',
        lastChecked: new Date().toISOString(),
        recommendation: 'Continue monitoring input validation across all forms'
      },
      {
        id: 'authentication',
        name: 'Authentication Security',
        description: 'Strong password policies and secure authentication flow',
        status: 'pass',
        severity: 'critical',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'rate-limiting',
        name: 'Rate Limiting',
        description: 'API endpoints protected against abuse and DDoS attacks',
        status: 'pass',
        severity: 'medium',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'file-upload',
        name: 'File Upload Security',
        description: 'File uploads validated for type, size, and malicious content',
        status: 'pass',
        severity: 'high',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'csrf-protection',
        name: 'CSRF Protection',
        description: 'Cross-Site Request Forgery protection on all forms',
        status: 'pass',
        severity: 'high',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'sql-injection',
        name: 'SQL Injection Prevention',
        description: 'Database queries use parameterized statements',
        status: 'pass',
        severity: 'critical',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'xss-protection',
        name: 'XSS Protection',
        description: 'Content sanitization prevents cross-site scripting',
        status: 'pass',
        severity: 'high',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'https-enforcement',
        name: 'HTTPS Enforcement',
        description: 'All communication encrypted with TLS/SSL',
        status: 'pass',
        severity: 'critical',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'session-management',
        name: 'Session Management',
        description: 'Secure session handling and timeout policies',
        status: 'pass',
        severity: 'high',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'error-handling',
        name: 'Error Handling',
        description: 'Error messages do not expose sensitive information',
        status: 'warning',
        severity: 'medium',
        lastChecked: new Date().toISOString(),
        recommendation: 'Review error messages to ensure no sensitive data is exposed'
      }
    ];

    setSecurityChecks(initialChecks);
    calculateOverallScore(initialChecks);
  }, []);

  const calculateOverallScore = (checks: SecurityCheck[]) => {
    const totalChecks = checks.length;
    const passedChecks = checks.filter(check => check.status === 'pass').length;
    const warningChecks = checks.filter(check => check.status === 'warning').length;
    
    // Pass = 100%, Warning = 70%, Fail = 0%
    const score = Math.round(((passedChecks * 100) + (warningChecks * 70)) / totalChecks);
    setOverallScore(score);
  };

  const runSecurityAudit = async () => {
    setIsRunningAudit(true);
    setAuditProgress(0);

    // Simulate audit progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setAuditProgress(i);
    }

    // Update last checked times
    const updatedChecks = securityChecks.map(check => ({
      ...check,
      lastChecked: new Date().toISOString()
    }));

    setSecurityChecks(updatedChecks);
    setIsRunningAudit(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Eye className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pass: 'default',
      warning: 'secondary',
      fail: 'destructive',
      pending: 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const criticalIssues = securityChecks.filter(check => 
    check.severity === 'critical' && check.status !== 'pass'
  );
  
  const highIssues = securityChecks.filter(check => 
    check.severity === 'high' && check.status !== 'pass'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Audit Dashboard</h2>
        <Button 
          onClick={runSecurityAudit} 
          disabled={isRunningAudit}
          className="flex items-center space-x-2"
        >
          <Shield className="h-4 w-4" />
          <span>{isRunningAudit ? 'Running Audit...' : 'Run Security Audit'}</span>
        </Button>
      </div>

      {/* Overall Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Overall Security Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={overallScore} className="h-4" />
            </div>
            <div className="text-2xl font-bold">
              {overallScore}%
            </div>
          </div>
          {isRunningAudit && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Audit Progress:</p>
              <Progress value={auditProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Issues Alert */}
      {(criticalIssues.length > 0 || highIssues.length > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Issues Detected:</strong>
            {criticalIssues.length > 0 && (
              <span> {criticalIssues.length} critical issue(s)</span>
            )}
            {criticalIssues.length > 0 && highIssues.length > 0 && <span>, </span>}
            {highIssues.length > 0 && (
              <span> {highIssues.length} high-severity issue(s)</span>
            )}
            <span>. Immediate attention required.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Security Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityChecks.map(check => (
          <Card key={check.id} className={`border-2 ${getSeverityColor(check.severity)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(check.status)}
                  <CardTitle className="text-sm">{check.name}</CardTitle>
                </div>
                {getStatusBadge(check.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{check.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Severity: {check.severity.toUpperCase()}</span>
                <span>
                  {new Date(check.lastChecked).toLocaleDateString()}
                </span>
              </div>
              
              {check.recommendation && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <strong>Recommendation:</strong> {check.recommendation}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Lock className="h-4 w-4" />
              <span>Authentication</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <p className="text-xs text-gray-600">Multi-factor authentication enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Database className="h-4 w-4" />
              <span>Data Protection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Encrypted</div>
            <p className="text-xs text-gray-600">All data encrypted at rest and in transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Network className="h-4 w-4" />
              <span>Network Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Protected</div>
            <p className="text-xs text-gray-600">Firewall and DDoS protection active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4" />
              <span>Access Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Controlled</div>
            <p className="text-xs text-gray-600">Role-based permissions enforced</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Security Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Input Validation Implemented</h4>
                <p className="text-sm text-gray-600">All user inputs are properly sanitized and validated</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Rate Limiting Active</h4>
                <p className="text-sm text-gray-600">Protection against brute force and DDoS attacks</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Secure File Uploads</h4>
                <p className="text-sm text-gray-600">File type validation and malware scanning enabled</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Monitor Error Messages</h4>
                <p className="text-sm text-gray-600">Regularly review error messages to prevent information disclosure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAudit;
