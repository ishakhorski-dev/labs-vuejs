import { describe, it, expect, beforeEach, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import App from "../src/App.vue";
import { mount } from "@vue/test-utils";

let wrapper = null;

describe("App.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(App);
  });

  it("Getting 3 in a row horizontally works correctly", async () => {
    const cells = wrapper.findAll('[data-test="cell"]');

    await cells[0].trigger("click"); // X at (0, 0)
    await cells[3].trigger("click"); // O at (1, 0)
    await cells[1].trigger("click"); // X at (0, 1)
    await cells[4].trigger("click"); // O at (1, 1)
    await cells[2].trigger("click"); // X at (0, 2)

    expect(wrapper.vm.winner).toBe("X");
    const winnerMessage = wrapper.find('[data-test="winner"]');
    expect(winnerMessage.exists()).toBe(true);
    expect(winnerMessage.text()).toContain("Player X wins!");
  });

  it("Getting 3 in a row vertically works correctly", async () => {
    const cells = wrapper.findAll('[data-test="cell"]');

    await cells[1].trigger("click"); // X at (0, 1)
    await cells[0].trigger("click"); // O at (0, 0)
    await cells[4].trigger("click"); // X at (1, 1)
    await cells[3].trigger("click"); // O at (1, 0)
    await cells[8].trigger("click"); // X at (2, 2)
    await cells[6].trigger("click"); // O at (2, 0)

    expect(wrapper.vm.winner).toBe("O");
    const winnerMessage = wrapper.find('[data-test="winner"]');
    expect(winnerMessage.exists()).toBe(true);
    expect(winnerMessage.text()).toContain("Player O wins!");
  });

  it("Getting 3 in a row diagonally works correctly", async () => {
    const cells = wrapper.findAll('[data-test="cell"]');

    await cells[0].trigger("click"); // X at (0, 0)
    await cells[1].trigger("click"); // O at (0, 1)
    await cells[4].trigger("click"); // X at (1, 1)
    await cells[2].trigger("click"); // O at (0, 2)
    await cells[8].trigger("click"); // X at (2, 2)

    expect(wrapper.vm.winner).toBe("X");
    const winnerMessage = wrapper.find('[data-test="winner"]');
    expect(winnerMessage.exists()).toBe(true);
    expect(winnerMessage.text()).toContain("Player X wins!");
  });

  it("When someone wins they are announced as the winner", async () => {
    const cells = wrapper.findAll('[data-test="cell"]');

    await cells[0].trigger("click"); // X at (0, 0)
    await cells[3].trigger("click"); // O at (1, 0)
    await cells[1].trigger("click"); // X at (0, 1)
    await cells[4].trigger("click"); // O at (1, 1)
    await cells[2].trigger("click"); // X at (0, 2)

    const winnerMessage = wrapper.find('[data-test="winner"]');
    expect(winnerMessage.exists()).toBe(true);
    expect(winnerMessage.text()).toContain("Player X wins!");
  });

  it("The user has the ability to start a new game", async () => {
    const cells = wrapper.findAll('[data-test="cell"]');

    await cells[0].trigger("click"); // X at (0, 0)
    await cells[1].trigger("click"); // O at (0, 1)

    const resetButton = wrapper.find(".controls__reset");
    await resetButton.trigger("click");

    cells.forEach((cell) => {
      expect(cell.text()).toBe("");
    });

    expect(wrapper.vm.board).toEqual([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    expect(wrapper.vm.player).toBe("X");
  });
});
