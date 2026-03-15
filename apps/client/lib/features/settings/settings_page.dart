import 'package:flutter/material.dart';

import '../../app/app_state_scope.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final settings = appState.settings;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (appState.error != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text(
              appState.error!,
              style: const TextStyle(color: Colors.red),
            ),
          ),
        SwitchListTile(
          title: const Text('Dark Mode'),
          value: settings.darkMode,
          onChanged: (value) {
            appState.updateSettings(
              settings.copyWith(darkMode: value),
            );
          },
        ),
        const SizedBox(height: 16),
        Text('Font Size: ${settings.fontSize.toStringAsFixed(0)}'),
        Slider(
          min: 12,
          max: 24,
          divisions: 12,
          value: settings.fontSize,
          onChanged: (value) {
            appState.updateSettings(
              settings.copyWith(fontSize: value),
            );
          },
        ),
        const SizedBox(height: 16),
        Text('Line Height: ${settings.lineHeight.toStringAsFixed(1)}'),
        Slider(
          min: 1.2,
          max: 2.0,
          divisions: 8,
          value: settings.lineHeight,
          onChanged: (value) {
            appState.updateSettings(
              settings.copyWith(lineHeight: value),
            );
          },
        ),
      ],
    );
  }
}
