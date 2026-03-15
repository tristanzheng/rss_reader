import 'package:flutter_test/flutter_test.dart';
import 'package:rss_reader_client/app/app.dart';
import 'package:rss_reader_client/core/models/entry_item.dart';
import 'package:rss_reader_client/core/models/feed_item.dart';
import 'package:rss_reader_client/core/state/app_state.dart';

void main() {
  testWidgets('app renders bottom navigation', (WidgetTester tester) async {
    final appState = AppState(
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

    await tester.pumpWidget(RssReaderAppWithState(appState: appState));
    await tester.pumpAndSettle();

    expect(find.text('Feeds'), findsOneWidget);
    expect(find.text('Entries'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);
  });
}
