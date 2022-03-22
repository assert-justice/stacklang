ID: register_test
TITLE: A Puzzle Testing A Single Register
DESCRIPTION: First inbox a number. Whatever that number is, inbox and sum that many values. Repeat until inbox is empty.
MAX_CYCLES: 1_000_000

IN: 2 12 34 ; should outbox 46
0 : should outbox 0
6 5 10 2 -8 2 -7 ; should outbox 4
rev empty

SOLUTION: mark top
0
mark loop
in dup snz
jmp output
add
jmp loop
mark output
del out
jmp top

END