import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

class PondSearch extends StatefulWidget {
  final ValueChanged<Pond> onSelected;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final ValueChanged<String>? onChanged;
  const PondSearch({super.key, required this.onSelected, this.controller, this.focusNode, this.onChanged});

  @override
  State<PondSearch> createState() => _PondSearchState();
}

class _PondSearchState extends State<PondSearch> {
  late final TextEditingController _controller;
  late final FocusNode _focusNode;
  bool _ownsController = false;
  bool _ownsFocus = false;
  bool _focused = false;

  Color _statusDot(PondStatus s) => switch (s) { PondStatus.safe => const Color(0xFF22c55e), PondStatus.warning => const Color(0xFFeab308), PondStatus.toxic => const Color(0xFFef4444) };

  @override
  void initState() {
    super.initState();
    _ownsController = widget.controller == null;
    _ownsFocus = widget.focusNode == null;
    _controller = widget.controller ?? TextEditingController();
    _focusNode = widget.focusNode ?? FocusNode();
    _focusNode.addListener(() {
      if (mounted) setState(() => _focused = _focusNode.hasFocus);
    });
    _controller.addListener(_onTextChanged);
  }

  void _onTextChanged() {
    final t = (_controller.text as dynamic) as String? ?? '';
    widget.onChanged?.call(t);
  }

  @override
  void didUpdateWidget(covariant PondSearch oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller || oldWidget.focusNode != widget.focusNode) {
      // ponytail: controller/focus ownership not changed mid-life in this app, keep simple
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_onTextChanged);
    if (_ownsController) _controller.dispose();
    if (_ownsFocus) {
      _focusNode.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RawAutocomplete<Pond>(
      textEditingController: _controller,
      focusNode: _focusNode,
      displayStringForOption: (p) => p.name,
      optionsBuilder: (value) {
        final raw = (value.text as dynamic) as String? ?? '';
        final q = raw.trim().toLowerCase();
        if (q.isEmpty) return const <Pond>[];
        return mockPonds.where((p) => (((p.name as dynamic) as String? ?? '').toLowerCase().contains(q)));
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
          margin: EdgeInsets.symmetric(horizontal: _focused ? 0 : 16),
          height: 38,
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(19),
            border: Border.all(color: _focused ? AppColors.accent : AppColors.border, width: _focused ? 1.6 : 1),
          ),
          padding: const EdgeInsets.only(left: 12),
          child: Row(children: [
            Expanded(
              child: TextField(
                controller: controller,
                focusNode: focusNode,
                onSubmitted: (_) => onFieldSubmitted(),
                inputFormatters: [LengthLimitingTextInputFormatter(60)],
                style: TextStyle(fontSize: 13, color: AppColors.text),
                decoration: InputDecoration(
                  hintText: t('header.searchPond'),
                  hintMaxLines: 1,
                  hintStyle: TextStyle(fontSize: 12, color: AppColors.textMuted.withValues(alpha: 0.8), overflow: TextOverflow.ellipsis),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 11),
                ),
              ),
            ),
            Icon(Icons.search, size: 15, color: AppColors.textMuted),
            const SizedBox(width: 8),
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
