class FeedItem {
  const FeedItem({
    required this.id,
    required this.title,
    required this.url,
  });

  final String id;
  final String title;
  final String url;

  factory FeedItem.fromJson(Map<String, dynamic> json) {
    return FeedItem(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      url: (json['url'] ?? '').toString(),
    );
  }
}
