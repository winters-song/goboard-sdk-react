
import {themeConfig as black} from './black/config'
import {themeConfig as black_t} from './black/config_t'
import {themeConfig as cosmos} from './cosmos/config'
import {themeConfig as cosmos_t} from './cosmos/config_t'
import {themeConfig as forest} from './forest/config'
import {themeConfig as forest_t} from './forest/config_t'
// 复盘样式
import {themeConfig as grade_t} from './grade/config_t'
import {themeConfig as kid_t} from './kid/config_t'

export const THEME = {
  BLACK: 'black',
  COSMOS: 'cosmos',
  FOREST: 'forest',
  GRADE: 'grade',
  KID: 'kid',
}

const DEFAULT_THEME = THEME.BLACK

const map = {
  black: {
    clsName: 'theme-black',
    config: black,
    config_t: black_t
  },
  cosmos: {
    clsName: 'theme-cosmos',
    config: cosmos,
    config_t: cosmos_t
  },
  forest: {
    clsName: 'theme-forest',
    config: forest,
    config_t: forest_t
  },
  grade: {
    clsName: 'theme-grade',
    // config: forest,
    config_t: grade_t
  },
  kid: {
    clsName: 'theme-kid',
    // config: forest,
    config_t: kid_t
  }
}

export function getThemeByName(name){

  const cfg = map[name] || map[THEME.BLACK]

  return {
    clsName : cfg.clsName,
    themeConfig : cfg.config ,
    themeConfigTeacher: cfg.config_t
  }
}

