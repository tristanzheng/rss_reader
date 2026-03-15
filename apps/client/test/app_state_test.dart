import 'package:flutter_test/flutter_test.dart';
import 'package:rss_reader_client/core/models/entry_item.dart';
import 'package:rss_reader_client/core/models/feed_item.dart';
import 'package:rss_reader_client/core/state/app_state.dart';

void main() {
  test('initialize loads feeds and entries via injected loaders', () async {
    final state = AppState(
      feedLoader: () async => const [
        FeedItem(id: 'f1', title: 'Feed 1', url: 'https://f1.test'),
      ],
      entryLoader: ({feedId}) async => const [
        EntryItem(
          id: 'e1',
          feedId: 'f1',
          title: 'Entry 1',
          summary: 'Summary',
          isRead: false,
          isSaved: false,
        ),
      ],
      markRead: (_) async {},
      markUnread: (_) async {},
      save: (_) async {},
      unsave: (_) async {},
      login: ({required userId, roles = const []}) async {},
    );

    await state.initialize();

    expect(state.feeds, isNotEmpty);
    expect(state.entries, isNotEmpty);
    expect(state.error, isNull);
  });

  test('refreshFeeds updates feeds and entries', () async {
    var callCount = 0;
    final state = AppState(
      feedLoader: () async {
        callCount += 1;
        if (callCount == 1) {
          return const [
            FeedItem(id: 'f1', title: 'Feed 1', url: 'https://f1.test'),
          ];
        }
        return const [
          FeedItem(id: 'f1', title: 'Feed 1', url: 'https://f1.test'),
          FeedItem(id: 'f2', title: 'Feed 2', url: 'https://f2.test'),
        ];
      },
      entryLoader: ({feedId}) async => const [
        EntryItem(
          id: 'e1',
          feedId: 'f1',
          title: 'Entry 1',
          summary: 'Summary',
          isRead: false,
          isSaved: false,
        ),
      ],
      markRead: (_) async {},
      markUnread: (_) async {},
      save: (_) async {},
      unsave: (_) async {},
      login: ({required userId, roles = const []}) async {},
    );

    await state.initialize();
    expect(state.feeds.length, 1);

    await state.refreshFeeds();
    expect(state.feeds.length, 2);
  });

  test('toggle read and saved updates state', () async {
    final state = AppState(
      feedLoader: () async => const [],
      entryLoader: ({feedId}) async => const [
        EntryItem(
          id: 'e1',
          feedId: 'f1',
          title: 'Entry 1',
          summary: 'Summary',
          isRead: false,
          isSaved: false,
        ),
      ],
      markRead: (_) async {},
      markUnread: (_) async {},
      save: (_) async {},
      unsave: (_) async {},
      login: ({required userId, roles = const []}) async {},
    );

    await state.initialize();

    final id = state.entries.first.id;
    final initialRead = state.entries.first.isRead;
    final initialSaved = state.entries.first.isSaved;

    await state.toggleRead(id);
    await state.toggleSaved(id);

    expect(state.entries.first.isRead, isNot(initialRead));
    expect(state.entries.first.isSaved, isNot(initialSaved));
  });
}
