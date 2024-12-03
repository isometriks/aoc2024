#!/usr/bin/perl

open(FH, "input.txt");
chomp(my @lines = <FH>);
my $full_file = join("\n", @lines);

sub match_and_sum
{
  my @matches = $_[0] =~ /mul\((\d+?),(\d+?)\)/g;
  my $sum = 0;

  for (my $i = 0; $i < $#matches; $i+=2) {
    $sum += @matches[$i] * @matches[$i+1];
  }

  return $sum;
}

$part1 = match_and_sum($full_file);
$part2 = 0;

@first_match = $full_file =~ m/^(.*?)don't\(\)/sg;
@dos = $full_file =~ /do\(\)(.*?)don't\(\)/sg;

for my $do ((@first_match, @dos)) {
  $part2 += match_and_sum($do)
}

print "Part 1: " . $part1 . "\n";
print "Part 2: " . $part2 . "\n";

