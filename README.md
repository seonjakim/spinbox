# Spinbox 생성하기

[link to spinbox page!](https://seonjakim.github.io/spinbox/)

# 프로젝트 의미

프로젝트의 크기에 비해 추상화 수준이 불필요하게 높지만 이는 재활용성을 높인 컴포넌트 구성을 연습하기 위해 의도적으로 구성한 부분입니다. 이 프로젝트를 통해 리액트의 특성이기도 한 stale closures에 대한 이해와 useState가 어떻게 batching되어서 렌더되고 그 과정에서 발생할 수 있는 오류에 대해 알게 되었습니다. 이를 해결할 수 있는 함수형 업데이트(Functional Updates)와 하나의 setState가 다양한 계산식을 가질 때, 함수형으로 업데이트가 되면서 하나의 함수로 여러 계산식을 관리할 수 있는 useReducer에 대해 이해하게 되었던 프로젝트입니다.

<br>

# 주요 목차

[[중요] Custom Hook - useLongPress 구현 과정](#[중요]-Custom-Hook---useLongPress-구현-과정)

- [피드백](#피드백)

[Lifecycle 데모](#Lifecycle)

- [Mount, Update와 Unmount](#Mount,-Update와-Unmount)

  - [Mount와 Render](#Mount와-Render)
  - [Update와 Re-render](#Update와-Re-render)

- [lifecyle을 모르면 발생할 수 있는 문제점 (Unmount설명)](<#lifecyle을-모르면-발생할-수-있는-문제점-(Unmount설명)>)

[useEffect 설명](#useEffect)

[Naming rules (참고자료 : Code complete 2)](<#Naming-rules-(참고자료-:-Code-complete-2)>)

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

# 피드백

- Mount, update, Unmount, useEffect에 대한 이해가 부족하다.
- Naming이 좋지 않다.

<br>

# Lifecycle

![](https://images.velog.io/images/seonja/post/747a57f9-3d5f-4867-8917-47caf479d16d/Screen%20Shot%202021-09-08%20at%2016.04.27.png)

모든 라이프 사이클을 살펴볼 수 있는 간단한 컴포넌트를 만들었습니다.
전체적으로는 Discussion, Rules, Workflow 컴포넌트를 구성하여 Router를 이용해서 각 컴포넌트를 mount와 unmount할 수 있도록 구성하였습니다.

<br>

## Mount, Update와 Unmount

![](https://images.velog.io/images/seonja/post/194fdea3-84db-4b39-9cc5-336bbf1061b2/mountUnmount.gif)

<br>

### Mount와 Render

그럼 먼저 Mount와 Render가 무엇인지 간단하게 정의를 하자면

- Mount : 컴포넌트가 생성되고 DOM에 주입되는 것을 의미하며 최초 한번만 실행됨
- Render : DOM에 그려주는 작업으로 props나 state값이 변할 때마다 해당 작업을 수행

<br>

위의 gif파일을 보시면 Mount시 constructor, (props가 있을 경우) getDerivedStateFromProps, render, componentDidMount 순서로 진행이 되며 다른 컴포넌트로 이동할 경우 componentWillUnmount가 실행되게 됩니다.

<br>

### Update와 Re-render

![](https://images.velog.io/images/seonja/post/3e5414b9-0afb-4333-9f6d-91e59d691767/updateRerender.gif)

update시 (props가 있을 경우) getDerivedStateFromProps, shouldComponentUpdate, render, getSnapshotBeforeUpdate, ComponentDidUpdate가 순서로 진행됩니다.

<br>

## 잘못 이해하고 있었던 부분

저는 하나의 사이트는 단 하나의 lifecycle을 가지고 있다고 착각하고 있었습니다. 이 생각이 이전에 useLongPress함수 구현 후 테스트시 단순히 console.log에 찍힌 사항들로 render의
빈도를 판단하게 했었고, 그 부분에서 lifecycle을 이해하지 못하고 있다는 피드백을 받았었던 것 같습니다.

<br>

> 각 컴포넌트는 모두 각각의 lifecycle을 가지고 있고 저 method들은 mount, update, unmount시 처리해줘야 하는 로직들을 처리할 수 있도록 도와주는 역할이라는 것을 인지하게 되었습니다.

<br>

## lifecyle을 모르면 발생할 수 있는 문제점 (Unmount설명)

![](https://images.velog.io/images/seonja/post/dd68b628-2145-4499-b4da-d661fddb6777/Screen%20Shot%202021-09-08%20at%2016.40.25.png)

Discussion 컴포넌트에 setInterval을 이용해서 시간을 update하도록 구성하였습니다.

![](https://images.velog.io/images/seonja/post/8793fdde-35e0-408c-b496-01567a336725/memleak.gif)

위의 gif와 같이 컴포넌트가 unmount되었음에도 Discussion 컴포넌트에서 setInterval이 발생하고 있어 메모리 누수가 생기게 됩니다.

<br>

이를 방지하기 위해서 clearInterval을 해줘야 하고 이 함수는 컴포넌트가 unmount될 때
사용하는 method인 componentWillUnmount에서 처리할 수 있습니다.

![](https://images.velog.io/images/seonja/post/d1f34d1a-bcaf-45cb-927e-d1deda19e215/Screen%20Shot%202021-09-08%20at%2016.48.13.png)

![](https://images.velog.io/images/seonja/post/1d5a00e3-cfec-4185-bac4-3aa53bb570bc/memleakUnmount.gif)

<br>

이와 같이 하나의 컴포넌트가 unmount되는 상황에서 해당 컴포넌트가 불필요한 연산이나 memory leak 발생을 방지하기 위해 처리해야하는 로직은 componentWillUnmount 메소드에서 처리하게 됩니다.

<br>

# useEffect

![](https://images.velog.io/images/seonja/post/e4f116d6-b093-49f6-aac1-28fae3c95a7f/image.png)
![](https://images.velog.io/images/seonja/post/3f9f6c12-a898-46fe-abb5-3fd15b9bac51/image.png)

useEffect는 componentDidMount, componentDidUpdate, componentWillUnmount, getDerivedStateFromProps 역할을 합니다.

## 형태

첫 번째 인자로 함수를 두 번째 인자로 배열을 넘겨줄 수 있습니다.

## useEffect의 lifecycle

앞에서 클래스 컴포넌트의 라이프사이클을 설명하였으므로 클래스에 대비하여 설명하도록 하겠습니다.

- componentDidMount : 두 번째 인자에 빈 배열을 전달할 경우 마운트시에만 실행되게 됩니다.

```javascript
useEffect(() => {
  /** componentDidMount */
}, [])
```

- componentWillUnmount : 첫 번째 인자로 넘기는 함수 내에서 반환(return)하는 형식으로 clean-up을 구현할 수 있습니다.

```javascript
useEffect(() => {
  return () => {
    /** componentWillUnmount */
  }
}, [])
```

- componentDidUpdate / getDerivedStateFromProps : 특정 state, props를 두 번째 인자인 배열에 작성할 경우 해당 값이 변경될 때 useEffect가 실행되게 됩니다. 첫 번째 인자의 함수 내 모든 변수를 배열에 작성하여 outdated variable 문제가 발생하지 않도록 합니다.

```javascript
useEffect(() => {
  /** componentDidUpdate */
}, [var1, var2])
```

### 합쳐진 모습

```javascript
useEffect(() => {
  /** componentDidMount + componentDidUpdate */
  return () => {
    /** componentWillUnmount */
  }
}, [var1, var2])
```

<br>
<br>

# Naming rules (참고자료 : Code complete 2)

### 고려사항

- 좋은 이름은 ‘어떻게’보다 ‘무엇’을 표현
- 긴 이름은 거의 사용하지 않는 변수나 전역변수에 좋고 짧은 이름은 지역 변수나 반복문 변수에 좋다.
- Total, Sum, Average, Max, Min, Record, String, Pointer과 같은 한정자로 변수 이름을 만들 경우 이름 끝네 한정자를 입력 ex) revenueTotal
  - 예외 : Num은 이름 앞에 있으면 총계를 가리키고 변수 끝에 있으면 인덱스를 가리킨다. 혼란을 피하기 위해 Count나 Total, Index를 사용하는 것이 좋다.

### 일반적인 변수명의 반의어

- begin / end
- first / last
- locked / unlocked
- min / max
- next / previous
- old / new
- opened / closed
- visible / invisible
- source / target
- source / destination
- up / down

### Boolean 변수 이름

- done 무언가 수행되었음을 가리키기 위해서 사용. done을 거짓으로 설정하고 완료되면 참으로 설정
- error 오류가 발생했음을 가리키기 위해 사용. 오류가 발생했을 때를 참으로 설정하고 발생하지 않았을 때를 거짓으로 설정
- found 값이 발견되었다는 것을 가리키기 위해 사용. 값이 발견되지 않았을 때 거짓으로 설정하고 발견되었을 때 참으로 설정
- success 또는 ok 연산이 성공적인지 가리키기 위해서 사용. 연산이 실패했을 때 거짓으로 설정하고 성공했을 때 참으로 설정. processingComplete와 같이 구체적인 이름으로 대체하면 더 정확하게 설명할 수 있다.
- is를 입력하면 간단한 논리 표현식에서 가독성이 떨어지게 된다. if (isFound)는 if (found)보다 가독성이 떨어진다.

### 이름 규약의 효과

- 작고 일시적인 프로젝트에서는 엄격한 규약이 불필요한 오버헤드일 것이다.

### 일반적인 축약어 가이드라인

- 불필요한 모음을 제거한다. (computer는 cmptr, screen은 scrn, apple은 appl, interger는 intgr로 사용)
- 관사와 접속사를 제거한다. (and, or, the, and 등)
- 첫 번째나 두 번째, 세 번째 문자와 같이 적절한 길이에서 일관성있게 단어를 자른다.
- 이름에서 가장 중요한 단어를 최대 세 단어까지 사용한다.
- 불필요한 접미사를 제거한다. (ing, ed 등)
