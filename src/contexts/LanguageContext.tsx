import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    'login': 'Login',
    'email': 'Email',
    'password': 'Password',
    'forgotPassword': 'Forgot Password?',
    'welcomeBack': 'Welcome Back',
    'loginSubtitle': 'Sign in to your pharmacy workspace',
    
    // Navigation
    'dashboard': 'Dashboard',
    'pos': 'Point of Sale',
    'medicines': 'Medicines',
    'cosmetics': 'Cosmetics',
    'inventory': 'Inventory',
    'purchasing': 'Purchasing',
    'shifts': 'Shifts',
    'reports': 'Reports',
    'branches': 'Branches',
    'users': 'Users & Roles',
    'subscription': 'Subscription',
    'settings': 'Settings',
    
    // Dashboard
    'todaySales': 'Today\'s Sales',
    'profit': 'Profit',
    'lowStock': 'Low Stock',
    'nearExpiry': 'Near Expiry',
    'expiredItems': 'Expired Items',
    'openShift': 'Open Shift',
    'topProducts': 'Top Selling Products',
    'recentActivity': 'Recent Activity',
    'salesTrend': 'Sales Trend',
    'quickActions': 'Quick Actions',
    'startPOS': 'Start POS',
    'startShift': 'Start Shift',
    'addProduct': 'Add Product',
    'createPO': 'Create Purchase Order',
    
    // POS
    'scanBarcode': 'Scan or Enter Barcode',
    'searchProducts': 'Search Products',
    'cart': 'Cart',
    'subtotal': 'Subtotal',
    'discount': 'Discount',
    'tax': 'Tax',
    'total': 'Total',
    'payment': 'Payment',
    'cash': 'Cash',
    'card': 'Card',
    'completeSale': 'Complete Sale',
    'holdSale': 'Hold',
    'clearCart': 'Clear',
    'customer': 'Customer',
    'addCustomer': 'Add Customer',
    
    // Products
    'productName': 'Product Name',
    'scientificName': 'Scientific Name',
    'tradeName': 'Trade Name',
    'barcode': 'Barcode',
    'category': 'Category',
    'supplier': 'Supplier',
    'representative': 'Representative',
    'batch': 'Batch',
    'expiryDate': 'Expiry Date',
    'purchasePrice': 'Purchase Price',
    'sellingPrice': 'Selling Price',
    'stock': 'Stock',
    'reorderLevel': 'Reorder Level',
    'branch': 'Branch',
    'allBranches': 'All Branches',
    'prescriptionRequired': 'Prescription Required',
    'addMedicine': 'Add Medicine',
    'addCosmetic': 'Add Cosmetic',
    
    // Common
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'view': 'View',
    'add': 'Add',
    'actions': 'Actions',
    'status': 'Status',
    'active': 'Active',
    'inactive': 'Inactive',
    'date': 'Date',
    'time': 'Time',
    'items': 'Items',
    'quantity': 'Quantity',
    'price': 'Price',
    'amount': 'Amount',
    'saving': 'Saving...',
    'deleting': 'Deleting...',
    'profile': 'Profile',
    'editMedicine': 'Edit Medicine',
    'basicInformation': 'Basic Information',
    
    // Onboarding
    'welcome': 'Welcome to PharmaSaaS',
    'setupWorkspace': 'Set Up Your Workspace',
    'orgName': 'Organization Name',
    'firstBranch': 'First Branch Name',
    'continue': 'Continue',
    'skip': 'Skip',
    
    // Shifts
    'currentShift': 'Current Shift',
    'startingCash': 'Starting Cash',
    'endShift': 'End Shift',
    'shiftSales': 'Shift Sales',
    'cashIn': 'Cash In',
    'cashOut': 'Cash Out',
    'expectedCash': 'Expected Cash',
    'actualCash': 'Actual Cash',
    'difference': 'Difference',
    
    // Reports
    'salesReport': 'Sales Report',
    'profitReport': 'Profit Report',
    'stockReport': 'Stock Report',
    'expiryReport': 'Expiry Report',
    'dateRange': 'Date Range',
    'generateReport': 'Generate Report',
    
    // Subscription
    'currentPlan': 'Current Plan',
    'upgradePlan': 'Upgrade Plan',
    'features': 'Features',
    'usage': 'Usage',
    'billingHistory': 'Billing History',
    
    // Branch
    'selectBranch': 'Select Branch',
    'mainBranch': 'Main Branch',
    'addBranch': 'Add Branch',
    'branchDetails': 'Branch Details',
  },
  ar: {
    // Auth
    'login': 'تسجيل الدخول',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'forgotPassword': 'نسيت كلمة المرور؟',
    'welcomeBack': 'مرحباً بعودتك',
    'loginSubtitle': 'قم بتسجيل الدخول إلى مساحة العمل الخاصة بك',
    
    // Navigation
    'dashboard': 'لوحة المعلومات',
    'pos': 'نقطة البيع',
    'medicines': 'الأدوية',
    'cosmetics': 'مستحضرات التجميل',
    'inventory': 'المخزون',
    'purchasing': 'المشتريات',
    'shifts': 'الورديات',
    'reports': 'التقارير',
    'branches': 'الفروع',
    'users': 'المستخدمين والأدوار',
    'subscription': 'الاشتراك',
    'settings': 'الإعدادات',
    
    // Dashboard
    'todaySales': 'مبيعات اليوم',
    'profit': 'الربح',
    'lowStock': 'مخزون منخفض',
    'nearExpiry': 'قريب من الانتهاء',
    'expiredItems': 'عناصر منتهية',
    'openShift': 'وردية مفتوحة',
    'topProducts': 'المنتجات الأكثر مبيعاً',
    'recentActivity': 'النشاط الأخير',
    'salesTrend': 'اتجاه المبيعات',
    'quickActions': 'إجراءات سريعة',
    'startPOS': 'بدء نقطة البيع',
    'startShift': 'بدء الوردية',
    'addProduct': 'إضافة منتج',
    'createPO': 'إنشاء طلب شراء',
    
    // POS
    'scanBarcode': 'مسح أو إدخال الباركود',
    'searchProducts': 'البحث عن المنتجات',
    'cart': 'السلة',
    'subtotal': 'المجموع الفرعي',
    'discount': 'الخصم',
    'tax': 'الضريبة',
    'total': 'الإجمالي',
    'payment': 'الدفع',
    'cash': 'نقدي',
    'card': 'بطاقة',
    'completeSale': 'إتمام البيع',
    'holdSale': 'تعليق',
    'clearCart': 'مسح',
    'customer': 'العميل',
    'addCustomer': 'إضافة عميل',
    
    // Products
    'productName': 'اسم المنتج',
    'scientificName': 'الاسم العلمي',
    'tradeName': 'الاسم التجاري',
    'barcode': 'الباركود',
    'category': 'الفئة',
    'supplier': 'المورد',
    'representative': 'المندوب',
    'batch': 'الدفعة',
    'expiryDate': 'تاريخ الانتهاء',
    'purchasePrice': 'سعر الشراء',
    'sellingPrice': 'سعر البيع',
    'stock': 'المخزون',
    'reorderLevel': 'مستوى إعادة الطلب',
    'branch': 'الفرع',
    'allBranches': 'جميع الفروع',
    'prescriptionRequired': 'يتطلب وصفة طبية',
    'addMedicine': 'إضافة دواء',
    'addCosmetic': 'إضافة مستحضر تجميل',
    
    // Common
    'search': 'بحث',
    'filter': 'تصفية',
    'export': 'تصدير',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'edit': 'تعديل',
    'delete': 'حذف',
    'view': 'عرض',
    'add': 'إضافة',
    'actions': 'الإجراءات',
    'status': 'الحالة',
    'active': 'نشط',
    'inactive': 'غير نشط',
    'date': 'التاريخ',
    'time': 'الوقت',
    'items': 'العناصر',
    'quantity': 'الكمية',
    'price': 'السعر',
    'amount': 'المبلغ',
    'saving': 'حفظ...',
    'deleting': 'حذف...',
    'profile': 'الملف الشخصي',
    'editMedicine': 'تعديل الدواء',
    'basicInformation': 'المعلومات الأساسية',
    
    // Onboarding
    'welcome': 'مرحباً بك في PharmaSaaS',
    'setupWorkspace': 'إعداد مساحة العمل',
    'orgName': 'اسم المؤسسة',
    'firstBranch': 'اسم الفرع الأول',
    'continue': 'متابعة',
    'skip': 'تخطي',
    
    // Shifts
    'currentShift': 'الوردية الحالية',
    'startingCash': 'النقد الابتدائي',
    'endShift': 'إنهاء الوردية',
    'shiftSales': 'مبيعات الوردية',
    'cashIn': 'إضافة نقد',
    'cashOut': 'سحب نقد',
    'expectedCash': 'النقد المتوقع',
    'actualCash': 'النقد الفعلي',
    'difference': 'الفرق',
    
    // Reports
    'salesReport': 'تقرير المبيعات',
    'profitReport': 'تقرير الأرباح',
    'stockReport': 'تقرير المخزون',
    'expiryReport': 'تقرير انتهاء الصلاحية',
    'dateRange': 'نطاق التاريخ',
    'generateReport': 'إنشاء التقرير',
    
    // Subscription
    'currentPlan': 'الخطة الحالية',
    'upgradePlan': 'ترقية الخطة',
    'features': 'الميزات',
    'usage': 'الاستخدام',
    'billingHistory': 'سجل الفواتير',
    
    // Branch
    'selectBranch': 'اختر الفرع',
    'mainBranch': 'الفرع الرئيسي',
    'addBranch': 'إضافة فرع',
    'branchDetails': 'تفاصيل الفرع',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}