import 'package:flutter_test/flutter_test.dart';
import 'package:rss_reader_client/core/models/reading_settings.dart';

void main() {
  test('reading settings defaults are expected', () {
    const defaults = ReadingSettings.defaults;

    expect(defaults.darkMode, isFalse);
    expect(defaults.fontSize, 16);
    expect(defaults.lineHeight, 1.5);
  });
}
