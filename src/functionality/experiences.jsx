import React from 'react';
import ResourceManagerPage from './ResourceManagerPage.jsx';
import { userDataService } from '../api/userDataService';

const EXPERIENCE_HINT = `{
  "title": "Senior Product Marketer",
  "company": "Optimos",
  "start_date": "2024-01-01",
  "end_date": null,
  "description": "Led profile-led growth campaigns."
}`;

export default function ExperiencesPage() {
  return (
    <ResourceManagerPage
      title="Experiences"
      activeNav="experiences"
      description="Manage your user-scoped work experiences using the authenticated experiences endpoints."
      listFn={userDataService.listExperiences}
      createFn={userDataService.createExperience}
      updateFn={userDataService.updateExperience}
      deleteFn={userDataService.deleteExperience}
      payloadHint={EXPERIENCE_HINT}
    />
  );
}
