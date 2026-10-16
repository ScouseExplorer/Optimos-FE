import React from 'react';
import ResourceManagerPage from './ResourceManagerPage.jsx';
import { userDataService } from '../api/userDataService';

const POST_HINT = `{
  "title": "3 growth experiments from this week",
  "body": "Experiment #1: lead with outcomes, not process...",
  "status": "draft",
  "scheduled_at": null
}`;

export default function PostsPage() {
  return (
    <ResourceManagerPage
      title="Posts"
      activeNav="posts"
      description="Manage your user-scoped posts with backend pagination and authenticated CRUD actions."
      listFn={userDataService.listPosts}
      createFn={userDataService.createPost}
      updateFn={userDataService.updatePost}
      deleteFn={userDataService.deletePost}
      payloadHint={POST_HINT}
    />
  );
}
