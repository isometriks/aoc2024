class Day4
  MATCH = "XMAS"

  def input
    @input ||= File.read("input.txt").chomp.split("\n")
  end

  def char_at(x, y)
    return if y < 0 || y >= input.size
    return if x < 0 || x >= input[y].size

    input[y][x]
  end

  def branch_from(x, y)
    (-1..1).filter_map do |dx|
      (-1..1).filter_map do |dy|
        match_direction(x, y, dx, dy)
      end.size
    end.sum
  end

  def match_direction(x, y, dx, dy, distance = 0)
    current_pos = [x + dx * distance, y + dy * distance]

    if char_at(*current_pos) == MATCH[distance]
      return true if distance == MATCH.size - 1
      match_direction(x, y, dx, dy, distance + 1)
    end
  end

  def iterate
    (0..input[0].size).each do |x|
      (0..input.size).each do |y|
        yield [x, y]
      end
    end
  end
end

day_4 = Day4.new
part_1 = 0
part_2 = 0

day_4.iterate do |x, y|
  part_1 += day_4.branch_from(x, y)
end

day_4.iterate do |x, y|
  next unless day_4.char_at(x, y) === "A"
  top_left = day_4.char_at(x - 1, y - 1)
  next unless ["M", "S"].include?(top_left)

  opposite_char = top_left == "M" ? "S" : "M"

  # tops same
  if top_left == day_4.char_at(x + 1, y - 1) &&
    opposite_char == day_4.char_at(x - 1, y + 1) &&
    opposite_char == day_4.char_at(x + 1, y + 1)
    part_2 += 1
  end

  # lefts same
  if top_left == day_4.char_at(x - 1, y + 1) &&
    opposite_char == day_4.char_at(x + 1, y - 1) &&
    opposite_char == day_4.char_at(x + 1, y + 1)
    part_2 += 1
  end
end

puts "Part 1: #{part_1}"
puts "Part 2: #{part_2}"
