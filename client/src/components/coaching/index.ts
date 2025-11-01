/**
 * Coaching Components Main Export
 * 
 * This is the main entry point for all coaching components.
 * Import from here to access any coaching-related functionality.
 */

// Component Loader (main router)
export { ComponentLoader } from './component-loader';

// Component Registry (metadata and helpers)
export {
  default as ComponentRegistry,
  ALL_COMPONENTS,
  WEEK1_COMPONENTS,
  WEEK2_COMPONENTS,
  WEEK3_COMPONENTS,
  WEEK4_COMPONENTS,
  WEEK5_6_COMPONENTS,
  getComponentInfo,
  getComponentsByWeek,
  renderCoachingComponent,
} from './component-registry';

// Week Modules
export { default as Week1Components } from './week1';
export { default as Week2Components } from './week2';
export { default as Week3Components } from './week3';
export { default as Week4Components } from './week4';
export { default as Week5Components } from './week5';

// Shared Types and Data
export * from './shared/types';
export * from './shared/data';

