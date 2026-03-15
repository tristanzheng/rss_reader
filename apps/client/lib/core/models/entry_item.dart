class EntryItem {
  const EntryItem({
    required this.id,
    required this.feedId,
    required this.title,
    required this.summary,
    required this.content,
    required this.url,
    required this.publishedAt,
    required this.isRead,
    required this.isSaved,
  });

  final String id;
  final String feedId;
  final String title;
  final String summary;
  final String content;
  final String url;
  final String publishedAt;
  final bool isRead;
  final bool isSaved;

  static final _htmlTag = RegExp(r'<[^>]*>');
  static final _whitespace = RegExp(r'\s+');

  factory EntryItem.fromJson(Map<String, dynamic> json) {
    final content = (json['content'] ?? '').toString();
    final plainText = content
        .replaceAll(_htmlTag, ' ')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll(_whitespace, ' ')
        .trim();
    final summary =
        plainText.length > 150 ? '${plainText.substring(0, 150)}…' : plainText;

    return EntryItem(
      id: (json['id'] ?? '').toString(),
      feedId: (json['feedId'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      summary: summary,
      content: content,
      url: (json['url'] ?? '').toString(),
      publishedAt: (json['publishedAt'] ?? '').toString(),
      isRead: json['isRead'] == true,
      isSaved: json['isSaved'] == true,
    );
  }

  EntryItem copyWith({
    bool? isRead,
    bool? isSaved,
  }) {
    return EntryItem(
      id: id,
      feedId: feedId,
      title: title,
      summary: summary,
      content: content,
      url: url,
      publishedAt: publishedAt,
      isRead: isRead ?? this.isRead,
      isSaved: isSaved ?? this.isSaved,
    );
  }
}
