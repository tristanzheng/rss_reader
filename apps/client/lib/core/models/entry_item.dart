class EntryItem {
  const EntryItem({
    required this.id,
    required this.feedId,
    required this.title,
    required this.summary,
    required this.isRead,
    required this.isSaved,
  });

  final String id;
  final String feedId;
  final String title;
  final String summary;
  final bool isRead;
  final bool isSaved;

  factory EntryItem.fromJson(Map<String, dynamic> json) {
    final content = (json['content'] ?? '').toString();
    final summary = content.length > 120 ? '${content.substring(0, 120)}…' : content;

    return EntryItem(
      id: (json['id'] ?? '').toString(),
      feedId: (json['feedId'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      summary: summary,
      isRead: false,
      isSaved: false,
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
      isRead: isRead ?? this.isRead,
      isSaved: isSaved ?? this.isSaved,
    );
  }
}
