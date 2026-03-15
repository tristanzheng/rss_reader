import 'package:flutter/material.dart';

import '../../app/app_state_scope.dart';

class EntriesPage extends StatelessWidget {
  const EntriesPage({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);

    return ListView.builder(
      itemCount: appState.entries.length,
      itemBuilder: (context, index) {
        final entry = appState.entries[index];
        return ListTile(
          title: Text(entry.title),
          subtitle: Text(entry.summary),
          leading: Icon(
            entry.isRead ? Icons.mark_email_read : Icons.mark_email_unread,
          ),
          trailing: Wrap(
            spacing: 8,
            children: [
              IconButton(
                icon: Icon(
                  entry.isSaved ? Icons.bookmark : Icons.bookmark_border,
                ),
                onPressed: () {
                  appState.toggleSaved(entry.id);
                },
              ),
              IconButton(
                icon: const Icon(Icons.done),
                onPressed: () {
                  appState.toggleRead(entry.id);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
