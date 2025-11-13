import clsx from "clsx"
import s from './loading-transition.module.scss'
export default function LoadingTransition() {
  return <div className={clsx(s.wrapper, s.visible)}>
  <div className={s.content}>
    <p>Загрузка данных...</p>
    <span className={s.loader}></span>

  </div>

</div>
}