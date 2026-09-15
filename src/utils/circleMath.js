// src/utils/circleMath.js
// Mathematical functions for Area of Circles (Primary 6, Singapore MOE)

export function pickPi(radius) {
  return radius % 7 === 0 ? 22 / 7 : 3.14;
}

export function pickPiLabel(radius) {
  return radius % 7 === 0 ? '22/7' : '3.14';
}

export function areaOfCircle(radius, piValue = pickPi(radius)) {
  const raw = piValue * radius * radius;
  return Math.round(raw * 100) / 100;
}

export function areaOfSemicircle(radius, piValue = pickPi(radius)) {
  const raw = (piValue * radius * radius) / 2;
  return Math.round(raw * 100) / 100;
}

export function areaOfQuarterCircle(radius, piValue = pickPi(radius)) {
  const raw = (piValue * radius * radius) / 4;
  return Math.round(raw * 100) / 100;
}

export function radiusFromDiameter(diameter) {
  return diameter / 2;
}

export function circumference(radius, piValue = pickPi(radius)) {
  const raw = 2 * piValue * radius;
  return Math.round(raw * 100) / 100;
}

export function areaOfTrack(length, radius, piValue = pickPi(radius)) {
  // Stadium track = Rectangle (L * 2r) + two semicircles (one full circle pi * r^2)
  const rectArea = length * (2 * radius);
  const circleArea = areaOfCircle(radius, piValue);
  return Math.round((rectArea + circleArea) * 100) / 100;
}

export function areaOfAnnulus(rOuter, rInner, piValue = pickPi(rOuter)) {
  const outer = areaOfCircle(rOuter, piValue);
  const inner = areaOfCircle(rInner, piValue);
  return Math.round((outer - inner) * 100) / 100;
}

export function formatArea(value, unit = 'cm') {
  return `${value} ${unit}\u00B2`;
}
