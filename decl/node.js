declare module "crypto" {
  declare function timingSafeEqual(
    a: Buffer | $TypedArray | DataView,
    b: Buffer | $TypedArray | DataView
  ): boolean
}
