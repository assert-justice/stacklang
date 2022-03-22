# StackLang
A toy programming language to learn about stacks and assembly.

Some day soon I'll finish my game HatStack that will use a graphical programming language that implements the language herein.

This project owes a debt to TIS-100, Human Resource Machine, and the Little man computer.

## The Virtual Machine

The StackLang VM consists of a few parts.

- A large stack (the exact size is platform specific but at least 1024 values). It works with decimal numbers in the range -9999 to 9999. If an operation would force a number out of that range the number is truncated within that range. Almost all the commands act on the stack in some way.

- An inbox and outbox. Programs can read values from an inbox and write values to an outbox with the `in` and `out` commands detailed below.

- 8 general purpose registers. The `lod` (load) and `sav` (save) commands detailed below can read to and write from them.

## Instruction Set
Below is a full table of the available instructions. Unless otherwise specified descriptions of "pushing" and "popping" values refers to the stack.
|Name|Stack -|Stack +|Description|
|---|---|---|---|
|Stack Manipulation
|in|0|1|Inbox a value and push it to the stack.|
|out|1|0|Pop a value and push it to the outbox.|
|dupe|1|2|Pop a value and push it to the stack twice.|
|del|1|0|Pop a value and discard it.|
|swp|2|2|Pop two values and push them in the reversed order.|
|lit*|0|1|Push a literal value to the stack.|
|Arithmetic|
|neg|1|1|Pop a value, negate it, and push it.|
|add|2|1|Pop two values, add them, and push the result.|
|sub|2|1|Pop two values, subtract the first from the second, and push the result.|
|mul|2|1|Pop two values, multiply them, and push the result.|
|div|2|1|Pop two values, divide the first by the second, and push the result.|
|rem|2|1|Pop two values, divide the first by the second, and push the remainder of the division.|
|Control Flow|
|jmp|0|0|Unconditionally jump to a label.|
|mark** \[label\]|0|0|Used to create labels. Has no corresponding opcode, used in assembly process.|
|sez|1|0|Pops a value. If it is equal to zero skip the next instruction.|
|slz|1|0|Pops a value. If it is less than zero skip the next instruction.|
|sgz|1|0|Pops a value. If it is greater than zero skip the next instruction.|
|snz|1|0|Pops a value. If it is not equal to zero skip the next instruction.|
|Registers|
|sav \[register\]|1|0|Pop a value and save it to the given register.|
|lod \[register\]|0|1|Load a value from a given register and push it.|
|Misc.|
|rev***|n|n|Reverse the stack.|
|rand|2|1|Pops two values. The first is the max and the second is the min. Pushes a random value between this number in the range [min,max).|
|noop|0|0|No operation. Does nothing but consumes a cycle. Can be useful for cycle accurate timings.|
|dump|0|0|Prints the state of the interpreter to the console. Useful for debugging.|
|empty|n|0|Pops every value from the stack and pushes it as if that many "out" commands were performed.|
|halt|0|0|Halts execution.|
|cycle|0|1|Pushes the number of cycles the interpreter has run for.|
|#** \[macro\]|0|0|Invokes a macro. For more information see below.|

*uncommented numbers in source files are converted to this instruction automatically

**pseudo-instruction, consumed during the assembly process.

***n values for stack changes indicate that the entire stack is consumed. If the stack is empty one of these instructions acts as a no-op.

## Macros

## Plugins

## Puzzles