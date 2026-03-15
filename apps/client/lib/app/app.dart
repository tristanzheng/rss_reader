import 'package:flutter/material.dart';

import 'app_state_scope.dart';
import '../core/api/http_client.dart';
import '../core/api/server_api.dart';
import '../core/api/token_store.dart';
import '../core/config/app_config.dart';
import '../core/state/app_state.dart';
import '../features/entries/entries_page.dart';
import '../features/settings/settings_page.dart';
import '../features/subscriptions/subscriptions_page.dart';

class RssReaderApp extends StatefulWidget {
  const RssReaderApp({super.key});

  @override
  State<RssReaderApp> createState() => _RssReaderAppState();
}

class _RssReaderAppState extends State<RssReaderApp> {
  late final AppState _appState;

  @override
  void initState() {
    super.initState();

    final tokenStore = TokenStore();
    final http = HttpClient(
      baseUrl: AppConfig.apiBaseUrl,
      tokenProvider: tokenStore.getToken,
    );
    final api = ServerApi(
      http: http,
      tokenWriter: tokenStore.setToken,
    );

    _appState = AppState(
      feedLoader: api.loadFeeds,
      entryLoader: api.loadEntries,
      markRead: api.markRead,
      markUnread: api.markUnread,
      save: api.save,
      unsave: api.unsave,
      login: ({required userId, roles = const ['worker']}) =>
          api.loginDevToken(userId: userId, roles: roles),
      bootstrapUserId: AppConfig.devUserId,
      bootstrapRoles: const ['worker'],
    );

    _appState.initialize();
  }

  @override
  void dispose() {
    _appState.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RssReaderAppWithState(appState: _appState);
  }
}

class RssReaderAppWithState extends StatelessWidget {
  const RssReaderAppWithState({
    super.key,
    required this.appState,
  });

  final AppState appState;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: appState,
      builder: (context, _) {
        final isDark = appState.settings.darkMode;

        return AppStateScope(
          appState: appState,
          child: MaterialApp(
            title: 'RSS Reader',
            theme: ThemeData(
              colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
              useMaterial3: true,
            ),
            darkTheme: ThemeData(
              colorScheme: ColorScheme.fromSeed(
                brightness: Brightness.dark,
                seedColor: Colors.teal,
              ),
              useMaterial3: true,
            ),
            themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
            home: const AppShell(),
          ),
        );
      },
    );
  }
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  static const _pages = [
    SubscriptionsPage(),
    EntriesPage(),
    SettingsPage(),
  ];

  static const _titles = [
    'Subscriptions',
    'Entries',
    'Settings',
  ];

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_index]),
        actions: [
          if (appState.error != null)
            IconButton(
              icon: const Icon(Icons.error_outline),
              onPressed: () {
                final errorText = appState.error!;
                appState.clearError();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(errorText)),
                );
              },
            ),
        ],
      ),
      body: Stack(
        children: [
          _pages[_index],
          if (appState.isLoading)
            const Align(
              alignment: Alignment.topCenter,
              child: LinearProgressIndicator(),
            ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) {
          setState(() {
            _index = value;
          });
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.rss_feed), label: 'Feeds'),
          NavigationDestination(icon: Icon(Icons.article), label: 'Entries'),
          NavigationDestination(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  }
}
