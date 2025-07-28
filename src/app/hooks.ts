import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// 当前应用的自定义useDispatch函数
//修改
export const useAppDispatch: () => AppDispatch = useDispatch
// 当前应用的自定义useSelector函数
//获取store中的状态
//它是基于Redux Toolkit的useSelector进行TypeScript类型增强的版本，提供更好的类型提示。
//useSelector自动帮你c
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;