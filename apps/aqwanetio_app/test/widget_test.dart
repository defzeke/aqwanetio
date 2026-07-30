import 'package:flutter_test/flutter_test.dart';
import 'package:aqwanetio_app/main.dart';

void main() {
  testWidgets('App renders home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const AqwaNetioApp());
    expect(find.byType(AqwaNetioApp), findsOneWidget);
  });
}
