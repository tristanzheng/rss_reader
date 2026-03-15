import '../config/app_config.dart';
import '../models/entry_item.dart';
import '../models/feed_item.dart';
import 'http_client.dart';

typedef FeedLoader = Future<List<FeedItem>> Function();
typedef EntryLoader = Future<List<EntryItem>> Function({String? feedId});
typedef EntryMutation = Future<void> Function(String entryId);
typedef LoginAction = Future<void> Function({
  required String userId,
  List<String> roles,
});

typedef TokenWriter = Future<void> Function(String token);

class ServerApi {
  ServerApi({
    required this.http,
    required this.tokenWriter,
  });

  final HttpClient http;
  final TokenWriter tokenWriter;

  Future<void> loginDevToken({
    required String userId,
    List<String> roles = const ['worker'],
  }) async {
    if (!AppConfig.enableDevTokenBootstrap) {
      return;
    }

    final json = await http.postJson(
      '/auth/dev-token',
      body: {
        'userId': userId,
        'roles': roles,
      },
    );

    if (json is! Map<String, dynamic> || json['token'] == null) {
      throw Exception('Invalid token response');
    }

    await tokenWriter(json['token'].toString());
  }

  Future<List<FeedItem>> loadFeeds() async {
    final json = await http.getJson('/feeds');
    if (json is! List) {
      throw Exception('Invalid feeds response');
    }

    return json.whereType<Map<String, dynamic>>().map(FeedItem.fromJson).toList();
  }

  Future<List<EntryItem>> loadEntries({String? feedId}) async {
    final query = <String, String>{
      'page': '1',
      'pageSize': '50',
      if (feedId != null) 'source': feedId,
    };

    final json = await http.getJson('/entries', query: query);
    if (json is! Map<String, dynamic>) {
      throw Exception('Invalid entries response');
    }

    final items = json['items'];
    if (items is! List) {
      return const [];
    }

    return items.whereType<Map<String, dynamic>>().map(EntryItem.fromJson).toList();
  }

  Future<void> markRead(String entryId) async {
    await http.postJson('/entries/$entryId/read');
  }

  Future<void> markUnread(String entryId) async {
    await http.deleteJson('/entries/$entryId/read');
  }

  Future<void> save(String entryId) async {
    await http.postJson('/entries/$entryId/save');
  }

  Future<void> unsave(String entryId) async {
    await http.deleteJson('/entries/$entryId/save');
  }
}
