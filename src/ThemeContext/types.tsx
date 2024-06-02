export enum IThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}
export interface IThemeContext {
  themeMode: IThemeMode
  switchThemeMode: (mode: IThemeMode) => void
}