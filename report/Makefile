CHAPTERS = $(wildcard chapters/*.tex)

report.pdf: report.tex $(CHAPTERS)
	pdflatex report.tex

clean:
	$(RM) *.aux *.log *.toc
.PHONY: clean
