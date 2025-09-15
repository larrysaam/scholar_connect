import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check if we can connect to Supabase
      console.log("Testing Supabase connection...");
      results.connection = "Connected";

      // Test 2: Test basic tables
      console.log("Testing tables...");

      // Test users table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, name')
        .limit(5);
      
      results.users = {
        success: !usersError,
        count: usersData?.length || 0,
        error: usersError?.message,
        data: usersData?.slice(0, 2) // Just show first 2 records
      };

      // Test jobs table
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, user_id, status')
        .limit(5);
      
      results.jobs = {
        success: !jobsError,
        count: jobsData?.length || 0,
        error: jobsError?.message,
        data: jobsData?.slice(0, 2)
      };

      // Test job_applications table
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('id, job_id, applicant_id, status')
        .limit(5);
      
      results.job_applications = {
        success: !applicationsError,
        count: applicationsData?.length || 0,
        error: applicationsError?.message,
        data: applicationsData?.slice(0, 2)
      };

      // Test complex join query
      const { data: joinData, error: joinError } = await supabase
        .from('job_applications')
        .select(`
          id,
          status,
          job:jobs(id, title, user_id),
          applicant:users!job_applications_applicant_id_fkey(id, name)
        `)
        .limit(3);
      
      results.join_query = {
        success: !joinError,
        count: joinData?.length || 0,
        error: joinError?.message,
        data: joinData
      };

      console.log("All test results:", results);
      
    } catch (error: any) {
      results.connection = `Error: ${error.message}`;
      console.error("Database test error:", error);
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Database Connection Test</h2>
        <Button onClick={runTests} disabled={loading}>
          {loading ? "Testing..." : "Run Tests"}
        </Button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {/* Connection Test */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={testResults.connection === "Connected" ? "text-green-600" : "text-red-600"}>
                {testResults.connection}
              </p>
            </CardContent>
          </Card>

          {/* Users Table Test */}
          {testResults.users && (
            <Card>
              <CardHeader>
                <CardTitle>Users Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={testResults.users.success ? "text-green-600" : "text-red-600"}>
                  {testResults.users.success 
                    ? `✓ Success - Found ${testResults.users.count} users` 
                    : `✗ Error: ${testResults.users.error}`
                  }
                </p>
                {testResults.users.data && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.users.data, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}

          {/* Jobs Table Test */}
          {testResults.jobs && (
            <Card>
              <CardHeader>
                <CardTitle>Jobs Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={testResults.jobs.success ? "text-green-600" : "text-red-600"}>
                  {testResults.jobs.success 
                    ? `✓ Success - Found ${testResults.jobs.count} jobs` 
                    : `✗ Error: ${testResults.jobs.error}`
                  }
                </p>
                {testResults.jobs.data && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.jobs.data, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}

          {/* Job Applications Table Test */}
          {testResults.job_applications && (
            <Card>
              <CardHeader>
                <CardTitle>Job Applications Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={testResults.job_applications.success ? "text-green-600" : "text-red-600"}>
                  {testResults.job_applications.success 
                    ? `✓ Success - Found ${testResults.job_applications.count} applications` 
                    : `✗ Error: ${testResults.job_applications.error}`
                  }
                </p>
                {testResults.job_applications.data && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.job_applications.data, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}

          {/* Join Query Test */}
          {testResults.join_query && (
            <Card>
              <CardHeader>
                <CardTitle>Complex Join Query</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={testResults.join_query.success ? "text-green-600" : "text-red-600"}>
                  {testResults.join_query.success 
                    ? `✓ Success - Found ${testResults.join_query.count} applications with details` 
                    : `✗ Error: ${testResults.join_query.error}`
                  }
                </p>
                {testResults.join_query.data && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.join_query.data, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;
