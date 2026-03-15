import 'package:flutter/material.dart';

import '../../app/app_state_scope.dart';
import '../../core/models/entry_item.dart';
import 'entry_detail_page.dart';

class EntriesPage extends StatelessWidget {
  const EntriesPage({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);

    if (appState.entries.isEmpty) {
      return const Center(child: Text('No entries'));
    }

    return ListView.separated(
      itemCount: appState.entries.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final entry = appState.entries[index];
        return _EntryTile(
          entry: entry,
          onTap: () {
            appState.toggleRead(entry.id);
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => EntryDetailPage(entry: entry),
              ),
            );
          },
          onToggleSaved: () => appState.toggleSaved(entry.id),
          onToggleRead: () => appState.toggleRead(entry.id),
        );
      },
    );
  }
}

class _EntryTile extends StatelessWidget {
  const _EntryTile({
    required this.entry,
    required this.onTap,
    required this.onToggleSaved,
    required this.onToggleRead,
  });

  final EntryItem entry;
  final VoidCallback onTap;
  final VoidCallback onToggleSaved;
  final VoidCallback onToggleRead;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final titleStyle = theme.textTheme.titleSmall?.copyWith(
      fontWeight: entry.isRead ? FontWeight.normal : FontWeight.bold,
      color: entry.isRead ? theme.colorScheme.onSurfaceVariant : null,
    );

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              entry.isRead ? Icons.circle_outlined : Icons.circle,
              size: 10,
              color: entry.isRead
                  ? theme.colorScheme.outline
                  : theme.colorScheme.primary,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(entry.title, style: titleStyle, maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Text(
                    entry.summary,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (entry.publishedAt.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      _formatDate(entry.publishedAt),
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: theme.colorScheme.outline,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 8),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: Icon(
                    entry.isSaved ? Icons.bookmark : Icons.bookmark_border,
                    size: 20,
                  ),
                  onPressed: onToggleSaved,
                  visualDensity: VisualDensity.compact,
                ),
                IconButton(
                  icon: Icon(
                    entry.isRead ? Icons.mark_email_read : Icons.mark_email_unread,
                    size: 20,
                  ),
                  onPressed: onToggleRead,
                  visualDensity: VisualDensity.compact,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String iso) {
    final dt = DateTime.tryParse(iso);
    if (dt == null) return iso;
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')} '
        '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}
