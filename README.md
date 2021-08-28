# Spinbox 생성하기

[link to spinbox page!](https://seonjakim.github.io/spinbox/)

# 프로젝트 의미

프로젝트의 크기에 비해 추상화 수준이 불필요하게 높지만 이는 재활용성을 높인 컴포넌트 구성을 연습하기 위해 의도적으로 구성한 부분입니다. 이 프로젝트를 통해 리액트의 특성이기도 한 stale closures에 대한 이해와 useState가 어떻게 batching되어서 렌더되고 그 과정에서 발생할 수 있는 오류에 대해 알게 되었습니다. 이를 해결할 수 있는 함수형 업데이트(Functional Updates)와 하나의 setState가 다양한 계산식을 가질 때, 함수형으로 업데이트가 되면서 하나의 함수로 여러 계산식을 관리할 수 있는 useReducer에 대해 이해하게 되었던 프로젝트입니다.

<br>

# 폴더와 파일 구성

![](https://images.velog.io/images/seonja/post/7186ba17-0741-4e66-8692-93644509402d/image.png)

- components : 하나의 페이지에 종속성을 가지고 있지 않은 요소들
- library : 여러 페이지에서 활용할 수 있는 함수
- pages : 실제 유저에게 보여지는 페이지 단위 (페이지가 많다면 각 페이지 기준으로 내부 폴더 생성 필요)
  - midAbstraction : 페이지에 종속성을 가지는 컴포넌트

이러한 기준으로 폴더를 구성하였습니다.

<br>

# [중요] Custom Hook - useLongPress 구현 과정

지긋이 누르고 있으면 점점 빠르게 숫자가 증가 또는 감소하는 함수는 어떻게 구현하면 좋을까?라는 고민에서 useEffect를 사용한 함수와 단순히 재귀로만 구현한 함수가 어떤 차이를 가지고 있을 것이라는 가정을 하여 두가지의 useLongPress를 구현하였습니다.

### 최초의 useEffect를 이용하여 구현한 useLongPress

```
const useLongPress = (callback, ms) => {
  const [isLongPress, setIsLongPress] = useState(false)
  const [time, setTime] = useState(ms)

  useEffect(() => {
    let timer
    if (isLongPress) {
      timer = setTimeout(callback, time)
      time > 100 && setTime(time - 90)
    } else {
      clearTimeout(timer)
      setTime(ms)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [callback, isLongPress])

  const onPress = () => {
    setIsLongPress(true)
  }
  const offPress = () => {
    setIsLongPress(false)
  }

  return {
    onMouseDown: onPress,
    onMouseUp: offPress,
    onMouseLeave: offPress,
  }
}

export default useLongPress
```

### 재귀함수로만 구현한 useLongPress

```
const useLongPress = (onLongPress = () => {}, ms = 1000) => {
  const timerRef = useRef(false)
  let delay = ms

  const onPress = () => {
    timerRef.current = setTimeout(() => {
      onLongPress()
      onPress()
    }, delay)
    /** shorten the delay time */
    delay > 100 ? (delay -= 90) : ''
  }

  const offPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = false
    }
  }

  return useMemo(
    () => ({
      onMouseDown: onPress,
      onMouseUp: offPress,
      onMouseLeave: offPress,
      onTouchStart: onPress,
      onTouchEnd: offPress,
    }),
    [onPress, offPress]
  )
}

export default useLongPress

```

![](https://images.velog.io/images/seonja/post/f61a676c-7fca-4fa0-aa86-362e4f287cae/image.png)

<br>

함수형 업데이트를 통해 재귀함수로만 구현된 함수가 렌더링 횟수가 절반에 가까운 것을 보고 useEffect 사용 유무보다는 함수형 업데이트 자체의 특성때문에 이런 차이가 만들어진다고 생각했고 최초의 useEffect를 이용하여 만든 useLongPress를 재귀적으로 구성해서 함수형 업데이트를 이용한 setState를 넘기는 방식으로 리팩토링해보았습니다.

## 최초의 useEffect를 이용한 useLongPress 리팩토링

![](https://images.velog.io/images/seonja/post/1e46699c-3717-4b31-97a0-85def53e8063/image.png)

![](https://images.velog.io/images/seonja/post/068d5022-fdb6-44df-ba7b-1036bda1dc00/image.png)

![](https://images.velog.io/images/seonja/post/06255dd4-723c-438f-be8c-0dc500a31c7c/image.png)

렌더링 횟수가 줄어든 것을 확인할 수 있었습니다.

# 결론

제가 이렇게 여러 고민을 했던 지점은 사용자가 여러번 눌렀음에도 불구하고 의도와 달리 숫자가 증가 또는 감소하는 형태의 오류를 없애고 싶은 욕심에서였고 setState 자체의 updating과정의 경우 그런 오류가 발생할 수 있다는 것을 알게 되었습니다.

setState의 경우 Object형태로 저장하여 batching이라는 과정을 통해 여러번의 호출을 하나로 묶어서 updating하게 됩니다. 이 과정에서 { number : number + 1 } 이라는 Object의 경우 여러번 호출됐음에도 불구하고 key값과 value가 같기에 batching과정에서 { number : number + 1 } 하나만 남아 숫자가 한번만 updating되는 오류가 발생할 수 있습니다.

함수형 업데이트로 구현할 경우 batching과정은 똑같지만 내부에 함수가 넘어감으로서 queue형태로 저장되게 되고 FIFO 방식으로 state가 계산된 후에 앞의 state를 참조하여 계산이 행해지므로 위와 같은 오류가 발생하지 않게 됩니다.

이 일련의 과정들이 useEffect는 불필요하다라는 의미이거나 useEffect와 함수형 업데이트를 비교하는 과정은 아니었습니다.

결론적으로 추가적인 Hook의 사용없이 재귀적으로 구현한 함수만으로도 충분하다고 생각하였고 해당 부분을 반영하여 SpinboxCard 컴포넌트를 구성하였습니다.

```
  const reducer = (number, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return Number(number) + 1
      case 'DECREMENT':
        return Number(number) - 1
      default:
        return action
    }
  }
  const [number, dispatchNumber] = useReducer(reducer, 0)

  const increase = () => {
    dispatchNumber({ type: 'INCREMENT' })
  }
  const decrease = () => {
    dispatchNumber({ type: 'DECREMENT' })
  }

  const longPressIncreaseCompare = useLongPressCompare(increase, 1000)
  const longPressDecreaseCompare = useLongPressCompare(decrease, 1000)

```

# 아직 부족한 개념

- Mount, update, Unmount
- useEffect
