defmodule Day2 do
  def input do
    File.stream!("input.txt")
    |> Enum.map(fn line ->
      String.split(line)
      |> Enum.map(&String.to_integer/1)
    end)
  end

  def part1(reports) do
    reports
    |> Enum.map(&check_report/1)
    |> Enum.count(fn x -> x == 0 end)
  end

  def part2(reports) do
    reports
    |> Enum.map(&check_report/1)
    |> Enum.count(fn x -> x <= 1 end)
  end

  defp check_report(report, position \\ 0, errors \\ 0, sign \\ nil) do
    left = Enum.at(report, position)
    right = Enum.at(report, position + 1)

    if right == nil do
      errors
    else
      diff = left - right

      cond do
        !safe_distance(left, right) ->
          rerun_report(report, position, errors)
        diff < 0 && (sign == nil || sign < 0) ->
          check_report(report, position + 1, errors, diff)
        diff > 0 && (sign == nil || sign > 0) ->
          check_report(report, position + 1, errors, diff)
        true ->
          rerun_report(report, position, errors)
      end
    end
  end

  defp rerun_report(report, position, errors) do
    if errors > 0 do
      2
    else
      [
        Enum.slice(report, 0, max(0, position - 1)) ++ Enum.slice(report, position, Enum.count(report)),
        Enum.slice(report, 0, position) ++ Enum.slice(report, position + 1, Enum.count(report)),
        Enum.slice(report, 0, position + 1) ++ Enum.slice(report, position + 2, Enum.count(report))
      ]
      |> Enum.map(fn new_report ->
        check_report(new_report, 0, 1)
      end)
      |> Enum.min
    end
  end

  defp safe_distance(left, right) do
    diff = abs(left - right)

    diff > 0 && diff < 4
  end
end

Day2.input()
|> Day2.part1()
|> IO.inspect()

Day2.input()
|> Day2.part2()
|> IO.inspect()
