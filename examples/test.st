SCRIPT: ; sum n
mark start
0 ; the running sum
in ; the number of numbers we want to sum
mark loop
dup sav $0
sgz
jmp done
in add
lod $0
1 sub
jmp loop
mark done
out
dump
jmp start
IN: 2 10 20 3 5 neg 10 neg 0 empty
END