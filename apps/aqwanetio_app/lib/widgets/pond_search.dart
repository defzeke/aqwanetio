import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

class PondSearch extends StatefulWidget {
  final ValueChanged<Pond> onSelected;
  const PondSearch({super.key, required this.onSelected});

  @override
  State<PondSearch> createState() => _PondSearchState();
}

class _PondSearchState extends State<PondSearch> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  bool _focused = false;

  Color _statusDot(PondStatus s) => switch (s) { PondStatus.safe => const Color(0xFF22c55e), PondStatus.warning => const Color(0xFFeab308), PondStatus.toxic => const Color(0xFFef4444) };

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(() {
      if (mounted) setState(() => _focused = _focusNode.hasFocus);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RawAutocomplete<Pond>(
      textEditingController: _controller,
      focusNode: _focusNode,
      displayStringForOption: (p) => p.name,
      optionsBuilder: (value) {
        final q = value.text.trim().toLowerCase();
        if (q.isEmpty) return const <Pond>[];
        return mockPonds.where((p) => p.name.toLowerCase().contains(q));
      },
      onSelected: (pond) {
        _controller.clear();
        _focusNode.unfocus();
        widget.onSelected(pond);
      },
      fieldViewBuilder: (context, controller, focusNode, onFieldSubmitted) {
        return AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOutCubic,
          height: 38,
          decoration: BoxDecoration(
            color: AppColors.inputBg,
            borderRadius: BorderRadius.circular(19),
            border: Border.all(color: _focused ? AppColors.accent : AppColors.border, width: _focused ? 1.6 : 1),
          ),
          padding: const EdgeInsets.only(left: 14),
          child: Row(children: [
            Expanded(
              child: TextField(
                controller: controller,
                focusNode: focusNode,
                onSubmitted: (_) => onFieldSubmitted(),
                inputFormatters: [LengthLimitingTextInputFormatter(60)],
                style: TextStyle(fontSize: 13, color: AppColors.text),
                cursorHeight: 16,
                decoration: InputDecoration(
                  hintText: t('header.searchPond'),
                  hintStyle: TextStyle(fontSize: 12, color: AppColors.textMuted.withValues(alpha: 0.8)),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  isDense: true,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ),
            Icon(Icons.search, size: 16, color: AppColors.textMuted),
            const SizedBox(width: 10),
          ]),
        );
      },
      optionsViewBuilder: (context, onSelected, options) {
        if (options.isEmpty) return const SizedBox.shrink();
        return Align(
          alignment: Alignment.topLeft,
          child: Material(
            color: AppColors.surface,
            elevation: 10,
            shadowColor: Colors.black.withValues(alpha: 0.4),
            borderRadius: BorderRadius.circular(12),
            clipBehavior: Clip.antiAlias,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 288, maxWidth: 264),
              child: ListView.builder(
                shrinkWrap: true,
                padding: const EdgeInsets.all(6),
                itemCount: options.length,
                itemBuilder: (context, i) {
                  final pond = options.elementAt(i);
                  return InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: () => onSelected(pond),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
                      child: Row(children: [
                        Container(width: 8, height: 8, decoration: BoxDecoration(color: _statusDot(pond.status), shape: BoxShape.circle)),
                        const SizedBox(width: 10),
                        Expanded(child: Text(pond.name, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 13, color: AppColors.text))),
                      ]),
                    ),
                  );
                },
              ),
            ),
          ),
        );
      },
    );
  }
}
