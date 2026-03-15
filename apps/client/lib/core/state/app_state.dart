import 'package:flutter/material.dart';

import '../api/server_api.dart';
import '../models/entry_item.dart';
import '../models/feed_item.dart';
import '../models/reading_settings.dart';

class AppState extends ChangeNotifier {
  AppState({
    required FeedLoader feedLoader,
    required EntryLoader entryLoader,
    required EntryMutation markRead,
    required EntryMutation markUnread,
    required EntryMutation save,
    required EntryMutation unsave,
    required LoginAction login,
    this.bootstrapUserId = 'u1',
    this.bootstrapRoles = const ['worker'],
  })  : _feedLoader = feedLoader,
        _entryLoader = entryLoader,
        _markRead = markRead,
        _markUnread = markUnread,
        _save = save,
        _unsave = unsave,
        _login = login;

  final FeedLoader _feedLoader;
  final EntryLoader _entryLoader;
  final EntryMutation _markRead;
  final EntryMutation _markUnread;
  final EntryMutation _save;
  final EntryMutation _unsave;
  final LoginAction _login;

  final String bootstrapUserId;
  final List<String> bootstrapRoles;

  List<FeedItem> feeds = const [];
  List<EntryItem> entries = const [];
  ReadingSettings settings = ReadingSettings.defaults;
  String? selectedFeedId;
  bool isLoading = false;
  String? error;

  Future<void> initialize() async {
    await _runGuarded(() async {
      await _login(userId: bootstrapUserId, roles: bootstrapRoles);
      feeds = await _feedLoader();
      entries = await _entryLoader();
    });
  }

  Future<void> refreshFeeds() async {
    await _runGuarded(() async {
      feeds = await _feedLoader();
      entries = await _entryLoader(feedId: selectedFeedId);
    }, silentLoading: true);
  }

  Future<void> selectFeed(String? feedId) async {
    selectedFeedId = feedId;
    await _runGuarded(() async {
      entries = await _entryLoader(feedId: feedId);
    }, silentLoading: true);
  }

  Future<void> toggleRead(String entryId) async {
    final index = entries.indexWhere((entry) => entry.id == entryId);
    if (index < 0) return;

    final current = entries[index];
    entries = entries
        .map((entry) => entry.id == entryId
            ? entry.copyWith(isRead: !entry.isRead)
            : entry)
        .toList();
    notifyListeners();

    try {
      if (current.isRead) {
        await _markUnread(entryId);
      } else {
        await _markRead(entryId);
      }
    } catch (exception) {
      entries = entries
          .map((entry) => entry.id == entryId ? current : entry)
          .toList();
      error = exception.toString();
      notifyListeners();
    }
  }

  Future<void> toggleSaved(String entryId) async {
    final index = entries.indexWhere((entry) => entry.id == entryId);
    if (index < 0) return;

    final current = entries[index];
    entries = entries
        .map((entry) => entry.id == entryId
            ? entry.copyWith(isSaved: !entry.isSaved)
            : entry)
        .toList();
    notifyListeners();

    try {
      if (current.isSaved) {
        await _unsave(entryId);
      } else {
        await _save(entryId);
      }
    } catch (exception) {
      entries = entries
          .map((entry) => entry.id == entryId ? current : entry)
          .toList();
      error = exception.toString();
      notifyListeners();
    }
  }

  void clearError() {
    error = null;
    notifyListeners();
  }

  void updateSettings(ReadingSettings next) {
    settings = next;
    notifyListeners();
  }

  Future<void> _runGuarded(
    Future<void> Function() action, {
    bool silentLoading = false,
  }) async {
    if (!silentLoading) {
      isLoading = true;
    }
    error = null;
    notifyListeners();

    try {
      await action();
    } catch (exception) {
      error = exception.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
