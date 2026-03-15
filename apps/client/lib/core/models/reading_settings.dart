class ReadingSettings {
  const ReadingSettings({
    required this.darkMode,
    required this.fontSize,
    required this.lineHeight,
  });

  final bool darkMode;
  final double fontSize;
  final double lineHeight;

  ReadingSettings copyWith({
    bool? darkMode,
    double? fontSize,
    double? lineHeight,
  }) {
    return ReadingSettings(
      darkMode: darkMode ?? this.darkMode,
      fontSize: fontSize ?? this.fontSize,
      lineHeight: lineHeight ?? this.lineHeight,
    );
  }

  static const defaults = ReadingSettings(
    darkMode: false,
    fontSize: 16,
    lineHeight: 1.5,
  );
}
