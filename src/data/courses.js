// Subject categories with their icon (string key into ICONS) and accent color.
export const CATEGORY_META = {
  math: { label: 'Математика', icon: 'Sigma', accent: 'brand' },
  physics: { label: 'Физика', icon: 'Atom', accent: 'blue' },
  cs: { label: 'Информатика', icon: 'Code2', accent: 'emerald' },
  ai: { label: 'Искусственный интеллект', icon: 'BrainCircuit', accent: 'pink' },
  web: { label: 'Веб-разработка', icon: 'Globe', accent: 'amber' },
  english: { label: 'Английский язык', icon: 'Languages', accent: 'teal' },
}

// Interest tags drive the recommendation engine (matched against onboarding answers).
export const INTERESTS = [
  { key: 'stem', label: 'STEM' },
  { key: 'programming', label: 'Программирование' },
  { key: 'business', label: 'Бизнес' },
  { key: 'finance', label: 'Финансы' },
  { key: 'science', label: 'Наука' },
  { key: 'social', label: 'Социальное влияние' },
  { key: 'languages', label: 'Языки' },
  { key: 'university', label: 'Поступление в вуз' },
]

export const courses = [
  {
    id: 'c-math',
    category: 'math',
    title: 'Основы математики',
    level: 'Начальный',
    language: 'ru',
    students: 2840,
    rating: 4.9,
    hours: 12,
    tags: ['stem', 'science', 'university'],
    description:
      'Прочный фундамент по алгебре и функциям. Подходит для подготовки к школьным экзаменам и олимпиадам начального уровня.',
    lessons: [
      {
        id: 'l1',
        title: 'Числа и операции',
        duration: '8 мин',
        points: [
          'Натуральные, целые и рациональные числа',
          'Порядок выполнения арифметических операций',
          'Свойства сложения и умножения',
        ],
        quiz: {
          q: 'Чему равно выражение 2 + 3 × 4?',
          options: ['20', '14', '24', '10'],
          correct: 1,
        },
      },
      {
        id: 'l2',
        title: 'Линейные уравнения',
        duration: '11 мин',
        points: [
          'Что такое уравнение и его корень',
          'Перенос слагаемых через знак равенства',
          'Решение уравнений вида ax + b = 0',
        ],
        quiz: {
          q: 'Найди x: 3x − 6 = 0',
          options: ['x = 0', 'x = 2', 'x = 3', 'x = −2'],
          correct: 1,
        },
      },
      {
        id: 'l3',
        title: 'Функции и графики',
        duration: '14 мин',
        points: [
          'Понятие функции и аргумента',
          'График линейной функции y = kx + b',
          'Как k влияет на наклон прямой',
        ],
        quiz: {
          q: 'Какой коэффициент отвечает за наклон прямой y = kx + b?',
          options: ['b', 'k', 'x', 'y'],
          correct: 1,
        },
      },
    ],
  },
  {
    id: 'c-english',
    category: 'english',
    title: 'Английский для академического успеха',
    level: 'Средний',
    language: 'en',
    students: 3920,
    rating: 4.8,
    hours: 16,
    tags: ['languages', 'university'],
    description:
      'Академический английский для эссе, презентаций и подготовки к IELTS. Реальные примеры и практика письма.',
    lessons: [
      {
        id: 'l1',
        title: 'Academic vocabulary',
        duration: '10 мин',
        points: [
          'Формальная и неформальная лексика',
          'Связующие слова: however, therefore, moreover',
          'Как избегать повторов в эссе',
        ],
        quiz: {
          q: 'Какое слово лучше подходит для академического эссе?',
          options: ['kids', 'children', 'guys', 'folks'],
          correct: 1,
        },
      },
      {
        id: 'l2',
        title: 'Essay structure',
        duration: '13 мин',
        points: [
          'Introduction, body, conclusion',
          'Тезис (thesis statement) и его роль',
          'Один абзац — одна мысль',
        ],
        quiz: {
          q: 'Где обычно находится thesis statement?',
          options: ['В заключении', 'В конце введения', 'В каждом абзаце', 'В заголовке'],
          correct: 1,
        },
      },
      {
        id: 'l3',
        title: 'IELTS Writing Task 2',
        duration: '15 мин',
        points: [
          'Типы заданий: opinion, discussion, problem-solution',
          'Минимум 250 слов и тайм-менеджмент',
          'Критерии оценки: coherence и lexical resource',
        ],
        quiz: {
          q: 'Сколько слов минимум нужно в IELTS Writing Task 2?',
          options: ['150', '200', '250', '400'],
          correct: 2,
        },
      },
    ],
  },
  {
    id: 'c-cs',
    category: 'cs',
    title: 'Основы информатики',
    level: 'Начальный',
    language: 'ru',
    students: 4510,
    rating: 4.9,
    hours: 14,
    tags: ['stem', 'programming'],
    description:
      'Как думают программисты: алгоритмы, переменные и логика. Первый шаг в мир кода без сложной теории.',
    lessons: [
      {
        id: 'l1',
        title: 'Что такое алгоритм',
        duration: '9 мин',
        points: [
          'Алгоритм как последовательность шагов',
          'Примеры алгоритмов в повседневной жизни',
          'Свойства: точность, конечность, понятность',
        ],
        quiz: {
          q: 'Какое свойство НЕ относится к алгоритму?',
          options: ['Конечность', 'Точность', 'Бесконечность', 'Понятность'],
          correct: 2,
        },
      },
      {
        id: 'l2',
        title: 'Переменные и типы данных',
        duration: '12 мин',
        points: [
          'Переменная как «коробка» для значения',
          'Числа, строки и логические значения',
          'Имена переменных и читаемость кода',
        ],
        quiz: {
          q: 'Какой тип данных у значения true?',
          options: ['Строка', 'Число', 'Логический', 'Список'],
          correct: 2,
        },
      },
      {
        id: 'l3',
        title: 'Условия и циклы',
        duration: '13 мин',
        points: [
          'Конструкция if / else',
          'Цикл for для повторяющихся действий',
          'Когда использовать цикл вместо копипаста',
        ],
        quiz: {
          q: 'Что делает цикл for?',
          options: [
            'Принимает решение один раз',
            'Повторяет действия несколько раз',
            'Хранит данные',
            'Завершает программу',
          ],
          correct: 1,
        },
      },
    ],
  },
  {
    id: 'c-physics',
    category: 'physics',
    title: 'Основы физики',
    level: 'Начальный',
    language: 'ru',
    students: 1960,
    rating: 4.7,
    hours: 13,
    tags: ['stem', 'science'],
    description:
      'Механика, силы и энергия простым языком. Понятные примеры из реального мира и базовые формулы.',
    lessons: [
      {
        id: 'l1',
        title: 'Движение и скорость',
        duration: '10 мин',
        points: [
          'Что такое путь, перемещение и скорость',
          'Формула v = s / t',
          'Равномерное и неравномерное движение',
        ],
        quiz: {
          q: 'Чему равна скорость, если путь 100 м пройден за 20 с?',
          options: ['2 м/с', '5 м/с', '20 м/с', '120 м/с'],
          correct: 1,
        },
      },
      {
        id: 'l2',
        title: 'Силы и законы Ньютона',
        duration: '14 мин',
        points: [
          'Сила как причина изменения движения',
          'Первый закон Ньютона (инерция)',
          'Второй закон: F = ma',
        ],
        quiz: {
          q: 'Что описывает формула F = ma?',
          options: ['Закон сохранения энергии', 'Второй закон Ньютона', 'Закон Ома', 'Скорость'],
          correct: 1,
        },
      },
    ],
  },
  {
    id: 'c-ai',
    category: 'ai',
    title: 'Введение в искусственный интеллект',
    level: 'Средний',
    language: 'ru',
    students: 2270,
    rating: 4.8,
    hours: 10,
    tags: ['stem', 'programming', 'science'],
    description:
      'Как работают нейросети и машинное обучение. Без сложной математики — на понятных примерах и аналогиях.',
    lessons: [
      {
        id: 'l1',
        title: 'Что такое ИИ',
        duration: '9 мин',
        points: [
          'Разница между ИИ, ML и нейросетями',
          'Где ИИ используется сегодня',
          'Данные — топливо для обучения моделей',
        ],
        quiz: {
          q: 'Что является «топливом» для обучения моделей ИИ?',
          options: ['Электричество', 'Данные', 'Интернет', 'Графика'],
          correct: 1,
        },
      },
      {
        id: 'l2',
        title: 'Как учится нейросеть',
        duration: '12 мин',
        points: [
          'Нейрон и связи между ними',
          'Обучение на примерах (обучающая выборка)',
          'Что такое ошибка и как модель её уменьшает',
        ],
        quiz: {
          q: 'На чём учится нейросеть?',
          options: ['На правилах', 'На примерах из данных', 'На случайностях', 'На формулах'],
          correct: 1,
        },
      },
    ],
  },
  {
    id: 'c-web',
    category: 'web',
    title: 'Веб-разработка с нуля',
    level: 'Начальный',
    language: 'ru',
    students: 3380,
    rating: 4.9,
    hours: 18,
    tags: ['programming'],
    description:
      'Создай свой первый сайт: HTML, CSS и основы JavaScript. От пустой страницы до рабочего проекта.',
    lessons: [
      {
        id: 'l1',
        title: 'HTML — структура страницы',
        duration: '11 мин',
        points: [
          'Теги, элементы и атрибуты',
          'Семантические теги: header, main, footer',
          'Структура базового HTML-документа',
        ],
        quiz: {
          q: 'Какой тег задаёт самый крупный заголовок?',
          options: ['<p>', '<h1>', '<div>', '<title>'],
          correct: 1,
        },
      },
      {
        id: 'l2',
        title: 'CSS — внешний вид',
        duration: '13 мин',
        points: [
          'Селекторы и свойства',
          'Цвета, отступы и шрифты',
          'Что такое адаптивный дизайн',
        ],
        quiz: {
          q: 'Какое свойство меняет цвет текста?',
          options: ['background', 'color', 'font-size', 'margin'],
          correct: 1,
        },
      },
    ],
  },
]

export function findCourse(id) {
  return courses.find((c) => c.id === id)
}
