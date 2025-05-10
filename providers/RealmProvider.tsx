import { RealmProvider as RNRealmProvider } from '@realm/react';
import React from 'react';
import { Todo } from '../models/Todo';

type RealmProviderProps = {
  children: React.ReactNode;
};

export function RealmProvider({ children }: RealmProviderProps) {
  return (
    <RNRealmProvider
      schema={[Todo]}
      deleteRealmIfMigrationNeeded={true}
    >
      {children}
    </RNRealmProvider>
  );
} 