import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import ErrorBoundary from '../common/ErrorBoundary.vue';

const ThrowingComponent = {
  setup() {
    throw new Error('Test error');
  },
  template: '<div>Should not render</div>',
};

const WorkingComponent = {
  template: '<div>Working component</div>',
};

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: WorkingComponent,
      },
    });

    expect(wrapper.text()).toContain('Working component');
    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(false);
  });

  it('renders error state when child component throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    });

    await nextTick();

    expect(wrapper.text()).toContain('Something went wrong');
    expect(wrapper.text()).toContain('Test error');
    expect(wrapper.find('[data-testid="error-retry-button"]').text()).toContain(
      'Try again'
    );

    consoleSpy.mockRestore();
  });

  it('emits retry event when try again button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    });

    await nextTick();
    await wrapper.find('[data-testid="error-retry-button"]').trigger('click');

    expect(wrapper.emitted('retry')).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
