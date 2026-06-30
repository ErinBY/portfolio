# 키오스크 주문 웹페이지 온톨로지 설계서

## 1. 목적

이 문서는 키오스크 주문 웹페이지 프로젝트를 온톨로지 관점에서 구조화하기 위한 기준 문서이다.  
프로젝트 안의 화면, 기능, 데이터, 사용자 흐름, UI 스타일 요소를 개념과 관계로 정의해 이후 확장, 문서화, 데이터 연계, AI 활용이 쉬운 형태로 정리한다.

---

## 2. 온톨로지화 목표

- 프로젝트의 핵심 개체를 명확히 정의한다.
- 개체 간 관계를 일관된 방식으로 표현한다.
- 화면 구조, 메뉴 데이터, 장바구니, 주문 흐름을 하나의 개념 체계로 연결한다.
- 추후 JSON-LD, RDF, OWL, 지식 그래프 형태로 확장 가능하도록 만든다.

---

## 3. 최상위 개념

### 3-1. Project
- 키오스크 주문 웹페이지 전체 프로젝트

### 3-2. Screen
- 사용자에게 보여지는 개별 화면 또는 화면 단위 UI

### 3-3. MenuDomain
- 메뉴, 카테고리, 옵션, 가격 등 메뉴 관련 정보 영역

### 3-4. CartDomain
- 장바구니와 주문 항목 관련 영역

### 3-5. OrderDomain
- 주문 확인, 결제 안내, 주문 상태 관련 영역

### 3-6. UIDesign
- 버튼, 카드, 타이포그래피, 색상 토큰 같은 UI 설계 요소

### 3-7. UserFlow
- 사용자가 따라가는 주문 흐름 단계

---

## 4. 클래스 정의

### 4-1. 프로젝트 클래스
- `KioskOrderProject`

### 4-2. 화면 클래스
- `StartScreen`
- `MenuSelectionScreen`
- `OptionSelectionModal`
- `CartScreen`
- `OrderConfirmationScreen`
- `PaymentGuideScreen`

### 4-3. 메뉴 클래스
- `MenuCategory`
- `MenuItem`
- `OptionGroup`
- `OptionChoice`
- `Price`
- `Badge`

### 4-4. 장바구니 및 주문 클래스
- `Cart`
- `CartItem`
- `Order`
- `OrderLine`
- `PaymentGuide`

### 4-5. UI 클래스
- `Button`
- `Card`
- `Sidebar`
- `Modal`
- `Typography`
- `ColorToken`
- `LayoutRule`

### 4-6. 흐름 클래스
- `FlowStep`
- `Interaction`
- `State`

---

## 5. 주요 관계 정의

### 프로젝트와 화면
- `hasScreen`
- `hasDesignSystem`
- `hasFlowStep`

### 화면 간 흐름
- `nextScreen`
- `opensModal`
- `returnsTo`

### 메뉴 구조
- `hasCategory`
- `hasMenuItem`
- `belongsToCategory`
- `hasOptionGroup`
- `hasOptionChoice`
- `hasPrice`
- `hasBadge`

### 장바구니 및 주문
- `hasCart`
- `containsCartItem`
- `referencesMenuItem`
- `hasSelectedOption`
- `hasQuantity`
- `hasTotalPrice`
- `createsOrder`

### UI/디자인
- `usesComponent`
- `usesColorToken`
- `usesTypography`
- `usesLayoutRule`
- `hasVisualState`

### 사용자 흐름
- `startsFrom`
- `selectsCategory`
- `selectsMenu`
- `addsToCart`
- `confirmsOrder`
- `movesToPaymentGuide`

---

## 6. 속성 정의

### 공통 속성
- `id`
- `name`
- `description`

### 화면 속성
- `screenTitle`
- `screenPurpose`
- `displayOrder`

### 메뉴 속성
- `priceValue`
- `categoryName`
- `isPopular`
- `isRequired`

### 장바구니 속성
- `quantityValue`
- `lineTotal`
- `cartTotal`

### 디자인 속성
- `colorHex`
- `fontSize`
- `fontWeight`
- `borderRadius`
- `spacingValue`

---

## 7. 이 프로젝트에 적용한 개체 예시

### 프로젝트 인스턴스
- `PureOrderKioskProject`

### 화면 인스턴스
- `StartScreen_Main`
- `MenuSelectionScreen_Main`
- `OptionSelectionModal_Main`

### 메뉴 카테고리 인스턴스
- `Category_Burger`
- `Category_Set`
- `Category_Side`
- `Category_Drink`

### 메뉴 인스턴스
- `Menu_ClassicBurger`
- `Menu_SignatureBurger`
- `Menu_FamilySet`
- `Menu_CrispyFries`
- `Menu_LemonAde`

### UI 토큰 인스턴스
- `Color_White`
- `Color_PointBlack`
- `Color_SoftGray`
- `Typography_DisplayHeading`
- `Layout_ThreeColumnKiosk`

---

## 8. 관계 예시

- `PureOrderKioskProject hasScreen StartScreen_Main`
- `PureOrderKioskProject hasScreen MenuSelectionScreen_Main`
- `MenuSelectionScreen_Main opensModal OptionSelectionModal_Main`
- `Menu_ClassicBurger belongsToCategory Category_Burger`
- `Menu_ClassicBurger hasOptionGroup OptionGroup_Size`
- `Cart_Main containsCartItem CartItem_1`
- `CartItem_1 referencesMenuItem Menu_ClassicBurger`
- `MenuSelectionScreen_Main usesLayoutRule Layout_ThreeColumnKiosk`
- `PrimaryButton usesColorToken Color_PointBlack`

---

## 9. 실무 적용 방법

### 문서 관점
- 기획서의 기능과 화면을 온톨로지 클래스 기준으로 재정리할 수 있다.

### 개발 관점
- JavaScript 객체 구조를 온톨로지 기준에 맞춰 표준화할 수 있다.
- 메뉴, 옵션, 장바구니 데이터를 일관된 스키마로 관리할 수 있다.

### 데이터 관점
- 추후 서버 연동 시 메뉴와 주문 데이터를 RDF 또는 JSON-LD 구조로 확장할 수 있다.

### AI 활용 관점
- 챗봇이나 추천 시스템이 메뉴, 옵션, 주문 흐름을 관계 기반으로 이해할 수 있다.

---

## 10. 권장 산출물

- 온톨로지 설명 문서: `kiosk-order-ontology.md`
- RDF/OWL 표현 파일: `kiosk-order-ontology.ttl`
- 필요 시 JSON-LD 변환 파일 추가 가능

---

## 11. 한 줄 요약

이 프로젝트의 온톨로지화는 키오스크 주문 웹페이지를 화면, 메뉴, 장바구니, 주문, 디자인, 사용자 흐름이라는 개념과 관계로 체계화해 확장성과 재사용성을 높이는 작업이다.
