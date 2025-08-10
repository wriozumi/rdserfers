import AutocompleteInput from "@/components/AutocompleteInput.vue";
import type { Station } from "@/types";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("AutocompleteInput", () => {
  const mockStation: Station = {
    id: "1",
    name: "Berlin",
    address: "Berlin Hauptbahnhof, Germany",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const wrapper = mount(AutocompleteInput);

    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("input").attributes("placeholder")).toBe(
      "Search stations..."
    );
  });

  it("emits search event when typing", async () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        minChars: 2,
      },
    });

    const input = wrapper.find("input");
    await input.setValue("Ber");

    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(wrapper.emitted("search")).toBeTruthy();
    expect(wrapper.emitted("search")?.[0]).toEqual(["Ber"]);
  });

  it("displays suggestions when provided", async () => {
    const wrapper = mount(AutocompleteInput);

    wrapper.vm.updateSuggestions([mockStation]);
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".absolute.z-50").exists()).toBe(true);
    expect(wrapper.text()).toContain("Berlin");
  });

  it("emits select event when suggestion is clicked", async () => {
    const wrapper = mount(AutocompleteInput);

    await wrapper.find("input").setValue("Ber");
    wrapper.vm.updateSuggestions([mockStation]);
    await wrapper.vm.$nextTick();

    await wrapper.find('button[type="button"]').trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]).toEqual([mockStation]);
  });

  it("handles keyboard navigation", async () => {
    const wrapper = mount(AutocompleteInput);

    await wrapper.find("input").setValue("Ber");
    wrapper.vm.updateSuggestions([mockStation]);
    await wrapper.vm.$nextTick();

    const input = wrapper.find("input");

    await input.trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.find('button[type="button"]').classes()).toContain(
      "bg-primary-50"
    );

    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("select")).toBeTruthy();
  });

  it("clears input when clear button is clicked", async () => {
    const wrapper = mount(AutocompleteInput);

    await wrapper.find("input").setValue("Berlin");
    await wrapper.vm.$nextTick();

    const clearButton = wrapper.find('button[type="button"]');
    await clearButton.trigger("click");

    expect(wrapper.find("input").element.value).toBe("");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([null]);
  });

  it("shows loading state", async () => {
    const wrapper = mount(AutocompleteInput);

    await wrapper.find("input").setValue("Berlin");

    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("shows no results message when appropriate", async () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        noResultsMessage: "No stations found",
      },
    });

    await wrapper.find("input").setValue("XYZ");
    wrapper.vm.updateSuggestions([]);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("No stations found");
  });
});
