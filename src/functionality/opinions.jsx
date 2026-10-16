import React from 'react';
import ResourceManagerPage from './ResourceManagerPage.jsx';
import { userDataService } from '../api/userDataService';

const OPINION_HINT = `{
  "topic": "LinkedIn content strategy",
  "sentiment": "positive",
  "opinion_text": "Short-form educational posts are driving stronger engagement this quarter."
}`;

export default function OpinionsPage() {
  return (
    <ResourceManagerPage
      title="Opinions"
      activeNav="opinions"
      description="Create, update, and remove your user-scoped opinion records with paginated history."
      listFn={userDataService.listOpinions}
      createFn={userDataService.createOpinion}
      updateFn={userDataService.updateOpinion}
      deleteFn={userDataService.deleteOpinion}
      payloadHint={OPINION_HINT}
    />
  );
}
