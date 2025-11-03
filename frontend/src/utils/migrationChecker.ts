import { supabase } from '@/integrations/supabase/client';

interface MigrationStatus {
  name: string;
  exists: boolean;
  description: string;
  required: boolean;
}

export const checkMigrationStatus = async (): Promise<MigrationStatus[]> => {
  const migrations: MigrationStatus[] = [
    {
      name: 'announcements',
      exists: false,
      description: 'Platform announcements system',
      required: true
    },
    {
      name: 'shared_documents',
      exists: false,
      description: 'Shared documents in service bookings',
      required: true
    }
  ];

  try {
    // Check if announcements table exists
    const { error: announcementsError } = await supabase
      .from('announcements')
      .select('id')
      .limit(1);

    if (!announcementsError) {
      migrations[0].exists = true;
    }

    // Check if shared_documents column exists in service_bookings
    const { error: sharedDocsError } = await supabase
      .from('service_bookings')
      .select('shared_documents')
      .limit(1);

    if (!sharedDocsError) {
      migrations[1].exists = true;
    }

  } catch (error) {
    console.error('Error checking migration status:', error);
  }

  return migrations;
};

export const getMigrationInstructions = (migrations: MigrationStatus[]): string[] => {
  const instructions: string[] = [];
  
  migrations.forEach(migration => {
    if (!migration.exists && migration.required) {
      if (migration.name === 'announcements') {
        instructions.push('Apply migration: supabase/migrations/20250115000001_create_announcements_table.sql');
      }
      if (migration.name === 'shared_documents') {
        instructions.push('Apply migration: supabase/migrations/20250822180000_add_shared_documents_to_bookings.sql');
      }
    }
  });

  if (instructions.length === 0) {
    instructions.push('All required migrations are applied ✅');
  }

  return instructions;
};
