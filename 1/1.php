<?php

function data() {
  $fp = fopen('input.txt', 'r');

  while (($line = stream_get_line($fp, 0, "\n")) !== false) {
    yield preg_split("/\s+/", $line);
  }
}

$leftArray = [];
$rightArray = [];
$rightArrayCounts = [];

foreach (data() as [$left, $right]) {
  $leftArray[] = intval($left);
  $rightArray[] = intval($right);

  if (!isset($rightArrayCounts[$right])) {
    $rightArrayCounts[$right] = 0;
  }

  $rightArrayCounts[$right]++;
}

sort($leftArray);
sort($rightArray);

$part1 = array_sum(array_map(function($left, $right) {
  return abs($left - $right);
}, $leftArray, $rightArray));

$part2 = array_sum(array_map(function($number) use ($rightArrayCounts) {
  return $number * ($rightArrayCounts[$number] ?? 0);
}, array_unique($leftArray)));

echo "Part 1: $part1 \n";
echo "Part 2: $part2 \n";
