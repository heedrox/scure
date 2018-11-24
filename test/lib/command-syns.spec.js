const { getCommandSyn } = require('../../src/lib/command-syns');
const { aCommandSyn, Commands } = require('../../src/dsl');

const scure = buildTestScure();

describe('Command Syncs', () => {
  it('replaces commands when argument is in your inventory', () => {
    scure.data.commandSyns = scure.data.commandSyns || [];
    scure.data.commandSyns.push(aCommandSyn(Commands.WALK, 'ric', Commands.USE));
    const argument = 'robot';
    const command = Commands.WALK;
    const data = { roomId: 'comedor' };

    const commandReplaced = getCommandSyn(command, argument, data, scure);

    expect(commandReplaced).to.equals(Commands.USE);
  });

  it('replaces command when argument is in same room', () => {
    scure.data.commandSyns = scure.data.commandSyns || [];
    scure.data.commandSyns.push(aCommandSyn(Commands.LOOK, 'comedor-cartera', Commands.USE));
    const command = Commands.LOOK;
    const argument = 'cartera';
    const data = { roomId: 'comedor' };

    const commandReplaced = getCommandSyn(command, argument, data, scure);

    expect(commandReplaced).to.equals(Commands.USE);
  });

  it('does not replace command if argument not in your inventory or in room', () => {
    scure.data.commandSyns = scure.data.commandSyns || [];
    scure.data.commandSyns.push(aCommandSyn(Commands.LOOK, 'comedor-cartera', Commands.USE));
    const command = Commands.LOOK;
    const argument = 'cartera';
    const data = { roomId: 'pasillo-norte' };

    const commandReplaced = getCommandSyn(command, argument, data, scure);

    expect(commandReplaced).to.equals(null);
  });

  it('does not replace command when argument not valid', () => {
    scure.data.commandSyns = scure.data.commandSyns || [];
    scure.data.commandSyns.push(aCommandSyn(Commands.LOOK, 'comedor-cartera', Commands.USE));
    const command = Commands.LOOK;
    const argument = 'un elemento que no existe';
    const data = { roomId: 'comedor' };

    const commandReplaced = getCommandSyn(command, argument, data, scure);

    expect(commandReplaced).to.equals(null);
  });
});
