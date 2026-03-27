
export type Yay<X> = {yay: true, value: X}
export type Nay = {yay: false, problems: string[]}
export type Maybe<X> = Yay<X> | Nay
export type Validator<X> = (x: X) => Maybe<X>

