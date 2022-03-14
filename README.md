# StackLang
A toy programming language to learn about stacks and assembly.

Some day soon I'll finish my game HatStack that will use a graphical programming language that implements the language herein.

This project owes a debt to TIS-100, Human Resource Machine, and the Little man computer.

## The Virtual Machine

The StackLang VM consists of a few parts.

- A large stack (the exact size is platform specific but at least 1024 values). It works with decimal numbers in the range -9999 to 9999. If an operation would force a number out of that range the number is truncated within that range. Almost all the commands act on the stack in some way.

- An inbox and outbox. Programs can read values from an inbox and write values to an outbox with the `in` and `out` commands detailed below.

- 8 general purpose registers. The `load` and `save` commands detailed below can read to and write from them.

## The Opcodes

### Stack Manipulation

### Arithmetic

### Control Flow

### Register Manipulation

## Plugins