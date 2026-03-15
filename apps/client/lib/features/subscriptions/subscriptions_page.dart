import 'package:flutter/material.dart';

import '../../app/app_state_scope.dart';

class SubscriptionsPage extends StatelessWidget {
  const SubscriptionsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);

    return RefreshIndicator(
      onRefresh: appState.refreshFeeds,
      child: ListView(
        children: [
          ListTile(
            title: const Text('Subscriptions'),
            subtitle: Text(
              appState.feeds.isEmpty
                  ? 'No feeds yet. Pull down to refresh.'
                  : 'Server-first: data from backend API',
            ),
            trailing: IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: appState.refreshFeeds,
            ),
          ),
          if (appState.error != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                appState.error!,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          ListTile(
            leading: const Icon(Icons.rss_feed),
            title: const Text('All feeds'),
            selected: appState.selectedFeedId == null,
            onTap: () {
              appState.selectFeed(null);
            },
          ),
          ...appState.feeds.map(
            (feed) => ListTile(
              leading: const Icon(Icons.folder_open),
              title: Text(feed.title),
              subtitle: Text(feed.url),
              selected: appState.selectedFeedId == feed.id,
              onTap: () {
                appState.selectFeed(feed.id);
              },
            ),
          ),
        ],
      ),
    );
  }
}
