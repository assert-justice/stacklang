ID: test
TITLE: A Test Puzzle
DESCRIPTION: In which an example is given. Sum all numbers until a zero is reached, then outbox the sum. Repeat until inbox is empty.
MAX_CYCLES: 1_000_000

IN: 12 34 0 55 0 0 rev empty

IN: 10 neg 20 0 5 neg 5 neg 0 10 neg 10 neg 20 0 rev empty

IN: ; randomized input
; the number of zero terminated sums to calculate
3 5 rand
mark top
; the length of the zero terminated sequence
5 10 rand
mark loop
100 neg 100 rand ; numbers range from [-100,100)
out

1 sub ; check if we are done with the sequence
dup
sez
jmp loop
out ; if we are, check if we are done producing sequences
1 sub
dup
sez
jmp top

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