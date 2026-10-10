import type { BookLessonPage } from '@/types/book'
import { dataTypesDiagram, inputOutputDiagram, variableBoxDiagram } from './diagrams'
import type { LearningCourseId } from './learning'

/**
 * Seeded reader pages. Only Python chapter 1 ("Variables", 6 pages) is
 * written for the demo, so the reader derives every total from this list
 * instead of the catalog's planned page counts.
 */
const pythonPages: BookLessonPage[] = [
  {
    id: 'lesson_python_1_1',
    courseId: 'python',
    chapterId: 'python-ch1',
    chapterNumber: 1,
    pageNumber: 1,
    title: 'What is a variable?',
    narrationText:
      'Variable na oru labeled box maari nenachikonga. Andha box-kulla oru value store pannalaam. Box mela irukkira label thaan variable name.',
    paragraphs: [
      'A program needs somewhere to keep the information it is working with. A variable is a name that refers to a value stored in memory.',
      'Think of it as a labeled box. The label is the variable name, and whatever sits inside the box is its value. When you use the name later, Python looks inside the box and hands you the value.',
      'Variables let you write code once and reuse it with different data — a score, a username, a price — without rewriting the logic each time.',
    ],
    keyTerms: ['variable', 'labeled box', 'value'],
    codeExample: {
      language: 'python',
      source: 'x = 10\nprint(x)\nprint(type(x))',
      expectedOutput: "10\n<class 'int'>",
      runnable: true,
    },
    diagramSpec: variableBoxDiagram,
    cues: [{ id: 'c1', atWord: 4, kind: 'focus-node', target: 'x' }],
    estimatedMinutes: 3,
  },
  {
    id: 'lesson_python_1_2',
    courseId: 'python',
    chapterId: 'python-ch1',
    chapterNumber: 1,
    pageNumber: 2,
    title: 'Assigning variables',
    narrationText:
      'Equals sign (=) use panni oru value-a variable-kku assign pannrom. Right side value first calculate aagum, appuram left side name-la store aagum. Reassign panna, pazhaya value replace aagidum.',
    paragraphs: [
      'You create a variable with the assignment operator, a single equals sign. The name goes on the left and the value on the right: score = 10.',
      'Python always evaluates the right side first, then stores the result under the name on the left. That is why score = score + 2 works: it reads the old value, adds 2, and stores 12.',
      'Assigning again simply points the name at a new value. The old value is replaced; the name itself does not change.',
    ],
    keyTerms: ['assignment operator', 'right side first', 'replaced'],
    codeExample: {
      language: 'python',
      source: 'score = 10\nscore = score + 2\nprint(score)',
      expectedOutput: '12',
      runnable: true,
    },
    diagramSpec: {
      kind: 'assignment-flow',
      title: 'Right side first, then store',
      caption: 'score = score + 2 reads 10, computes 12, then stores it.',
      nodes: [
        { id: 'read', label: 'Read', value: '10', caption: 'old value' },
        { id: 'compute', label: '10 + 2', value: '12', caption: 'evaluate', tone: 'highlight' },
        { id: 'store', label: 'score', value: '12', caption: 'stored', tone: 'valid' },
      ],
    },
    estimatedMinutes: 4,
  },
  {
    id: 'lesson_python_1_3',
    courseId: 'python',
    chapterId: 'python-ch1',
    chapterNumber: 1,
    pageNumber: 3,
    title: 'Data types',
    narrationText:
      'Ovvoru value-kkum oru data type irukku. 10 na int, 3.5 na float, "Priya" na string, True na boolean, [90, 85, 77] na list. type() function use panni check pannalaam.',
    paragraphs: [
      'Every value in Python has a data type that decides what you can do with it. You never declare the type yourself — Python infers it from the value.',
      'Whole numbers are int, numbers with a decimal point are float, text inside quotes is a str (string), True or False is a bool (boolean), and a list such as [90, 85, 77] holds several values in order.',
      'Use the built-in type() function whenever you are unsure. Mixing types matters: "5" + 5 raises an error, while int("5") + 5 gives 10.',
    ],
    keyTerms: ['data type', 'int', 'float', 'str', 'bool', 'list', 'type()'],
    codeExample: {
      language: 'python',
      source:
        'age = 21\nprice = 3.5\nname = "Priya"\nready = True\nscores = [90, 85, 77]\nprint(type(age), type(price))\nprint(type(name), type(ready))\nprint(type(scores))',
      expectedOutput: "<class 'int'> <class 'float'>\n<class 'str'> <class 'bool'>\n<class 'list'>",
      runnable: true,
    },
    diagramSpec: dataTypesDiagram,
    estimatedMinutes: 4,
  },
  {
    id: 'lesson_python_1_4',
    courseId: 'python',
    chapterId: 'python-ch1',
    chapterNumber: 1,
    pageNumber: 4,
    title: 'Naming rules',
    narrationText:
      'Variable name letter illa underscore-la start aaganum, number-la start aaga koodathu. Space allowed illa, adhukku badhila underscore podunga. Python case-sensitive, so Score-um score-um vera vera.',
    paragraphs: [
      'Variable names must start with a letter or an underscore, never a digit. After the first character you can use letters, digits, and underscores.',
      'Spaces and symbols like - or ! are not allowed. Python style uses snake_case: lowercase words joined by underscores, such as total_score.',
      'Names are case-sensitive, so score and Score are two different variables. Reserved keywords like if, for, and class cannot be used as names.',
    ],
    keyTerms: ['letter or an underscore', 'snake_case', 'case-sensitive', 'keywords'],
    codeExample: {
      language: 'python',
      source: 'total_score = 42\n_hidden = "ok"\nplayer2 = "Arun"\n# 2player = "no"   -> SyntaxError\n# total score = 1  -> SyntaxError\nprint(total_score, player2)',
      expectedOutput: '42 Arun',
      runnable: true,
    },
    diagramSpec: {
      kind: 'naming-rules',
      title: 'Valid or not?',
      caption: 'Start with a letter or underscore; no spaces or symbols.',
      nodes: [
        { id: 'n1', label: 'total_score', caption: 'snake_case', tone: 'valid' },
        { id: 'n2', label: '_hidden', caption: 'underscore start', tone: 'valid' },
        { id: 'n3', label: 'player2', caption: 'digit after letter', tone: 'valid' },
        { id: 'n4', label: '2player', caption: 'starts with digit', tone: 'invalid' },
        { id: 'n5', label: 'total score', caption: 'contains space', tone: 'invalid' },
        { id: 'n6', label: 'class', caption: 'reserved keyword', tone: 'invalid' },
      ],
    },
    estimatedMinutes: 3,
  },
  {
    id: 'lesson_python_1_5',
    courseId: 'python',
    chapterId: 'python-ch1',
    chapterNumber: 1,
    pageNumber: 5,
    title: 'input() and print()',
    narrationText:
      'input() user kitta irundhu text vaangum, print() screen-la kaattum. input() eppovume string thaan return pannum, so number venumna int() use panni convert pannunga.',
    paragraphs: [
      'print() shows values on the screen. Pass several values separated by commas and print() puts a space between them.',
      'input() pauses the program, shows a prompt, and returns whatever the user types — always as a string.',
      'If you need a number, convert it: age = int(input("Age? ")). Forgetting this is the most common beginner bug with input().',
    ],
    keyTerms: ['print()', 'input()', 'always as a string', 'int('],
    codeExample: {
      language: 'python',
      source: 'name = input("Your name? ")\nage = int(input("Your age? "))\nprint("Hi", name)\nprint("Next year you will be", age + 1)',
      expectedOutput: 'Your name? Priya\nYour age? 21\nHi Priya\nNext year you will be 22',
      runnable: true,
    },
    diagramSpec: inputOutputDiagram,
    estimatedMinutes: 4,
  },
  {
    id: 'lesson_python_1_6',
    courseId: 'python',
    chapterId: 'python-ch1',
    chapterNumber: 1,
    pageNumber: 6,
    title: 'Mini practice',
    narrationText:
      'Ippo practice time! Oru chinna bill calculator ezhudhalam. Item price and quantity variables-la store panni, total calculate panni, print pannunga.',
    paragraphs: [
      'Put the chapter together with a tiny bill calculator. Store an item name, its price, and a quantity in three well-named variables.',
      'Compute the total by multiplying price and quantity, store it in a new variable, and print a friendly summary line.',
      'Try it yourself: change the quantity, add a discount variable, or ask for the quantity with input() and convert it with int().',
    ],
    keyTerms: ['three well-named variables', 'Try it yourself'],
    codeExample: {
      language: 'python',
      source: 'item = "Notebook"\nprice = 45.0\nquantity = 3\ntotal = price * quantity\nprint(item, "x", quantity, "=", total)',
      expectedOutput: 'Notebook x 3 = 135.0',
      runnable: true,
    },
    diagramSpec: {
      kind: 'practice',
      title: 'Your bill calculator',
      caption: 'Three inputs, one computed result.',
      nodes: [
        { id: 'item', label: 'item', value: '"Notebook"', caption: 'str' },
        { id: 'price', label: 'price', value: '45.0', caption: 'float' },
        { id: 'quantity', label: 'quantity', value: '3', caption: 'int' },
        { id: 'total', label: 'total', value: '135.0', caption: 'price * quantity', tone: 'highlight' },
      ],
    },
    estimatedMinutes: 6,
  },
]

const pagesByCourse: Partial<Record<LearningCourseId, BookLessonPage[]>> = {
  python: pythonPages,
}

export function getBookPages(courseId: string): BookLessonPage[] {
  return pagesByCourse[courseId as LearningCourseId] ?? []
}

/** 1-based position of a page inside its chapter (matches library PageRef.page). */
export function pageInChapter(pages: BookLessonPage[], page: BookLessonPage) {
  return pages.filter((entry) => entry.chapterNumber === page.chapterNumber).findIndex((entry) => entry.id === page.id) + 1
}

/** Index into `pages` for a chapter/page deep link, or -1 when not seeded. */
export function findPageIndex(pages: BookLessonPage[], chapter: number, page: number) {
  let position = 0
  return pages.findIndex((entry) => {
    if (entry.chapterNumber !== chapter) return false
    position += 1
    return position === page
  })
}
