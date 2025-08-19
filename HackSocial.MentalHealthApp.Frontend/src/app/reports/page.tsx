"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, FileText, Download, Sparkles, X } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar"
import { AppSidebar } from "@/src/components/ui/appsidebar"
import apiHandler, {IReport} from "@/src/data/api/apiHandler"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"

export default function ReportsPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<IReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await apiHandler.reports.list()
        setReports(reportsData)
      } catch (error) {
        console.error("Failed to fetch reports:", error)
        toast.error("Failed to load reports. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const newReport = await apiHandler.reports.generate()
      toast.success("Report generated successfully!")
      setReports(prev => [newReport, ...prev])
    } catch (error) {
      console.error("Failed to generate report:", error)
      toast.error("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

 const handleDownloadReport = async (reportId: string) => {
  try {
    toast.info("Downloading report...")

    const response = await apiHandler.reports.download(reportId)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `report-${reportId}.pdf`) 
    document.body.appendChild(link)
    link.click()

    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success("Report downloaded successfully!")
  } catch (error) {
    console.error("Failed to download report:", error)
    toast.error("Failed to download report. Please try again.")
  }
}

  const openReportModal = (report: IReport) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const closeReportModal = () => {
    setIsModalOpen(false)
    setSelectedReport(null)
  }

  const formatReportContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
        <br />
      </p>
    ))
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen min-w-full bg-gradient-to-br from-sage-50 via-white to-lavender-50 flex flex-col">
        <div className="bg-white border-b border-sage-100 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SidebarTrigger className="hover:bg-sage-100 rounded-lg" />
              </div>

              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />

          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
              <div className="space-y-6">
                <Card className="border-sage-100">
                  <CardHeader>
                    <CardTitle className="text-sage-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Mental Health Reports
                    </CardTitle>
                    <p className="text-sm text-sage-600">
                      View and download your generated mental health reports
                    </p>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                      </div>
                    ) : reports.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-sage-400" />
                        <h3 className="mt-2 text-sm font-medium text-sage-900">
                          No reports generated yet
                        </h3>
                        <p className="mt-1 text-sm text-sage-500">
                          Click "Generate Report" to create your first mental health report.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reports.map((report) => (
                          <div
                            key={report.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-sage-100 hover:bg-sage-25 transition-colors cursor-pointer"
                            onClick={() => openReportModal(report)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2 rounded-full bg-sage-100 text-sage-600">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sage-900">
                                  Mental Health Report
                                </h4>
                                <p className="text-sm text-sage-500">
                                  Generated on {new Date(report.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              className="border-sage-200 text-sage-700 hover:bg-sage-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadReport(report.id)
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-sage-100 bg-sage-25">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-sage-600" />
                      <span className="text-sm font-medium text-sage-900">
                        About Mental Health Reports
                      </span>
                    </div>
                    <ul className="text-xs text-sage-700 space-y-1">
                      <li>• Reports analyze your journal entries and mood trends</li>
                      <li>• Identify patterns in your emotional well-being</li>
                      <li>• Provide insights and recommendations</li>
                      <li>• Generated reports are private and secure</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>

        {/* Report Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeReportModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-sage-600" />
                  <span>Mental Health Report</span>
                </div>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeReportModal}
                  className="text-sage-500 hover:text-sage-700"
                >
                  <X className="w-5 h-5" />
                </Button> */}
              </DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-sage-500">
                    Generated on {new Date(selectedReport.timestamp).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    className="border-sage-200 text-sage-700 hover:bg-sage-50"
                    onClick={() => handleDownloadReport(selectedReport.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="prose max-w-none text-sage-800">
                  {formatReportContent(selectedReport.content)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  )
}