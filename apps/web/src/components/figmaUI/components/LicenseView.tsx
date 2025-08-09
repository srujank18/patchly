import { ChevronRight, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { licensePackages } from "../constants/mockData"

export function LicenseView() {
  const breadcrumbs = [
    { label: "Dashboard", href: "#" },
    { label: "License", href: "#" }
  ]

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Multiple Breadcrumb Examples */}
      <div className="space-y-4">
        {/* Breadcrumb 1 */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-border rounded"></div>
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span>License</span>
          </div>
        </nav>

        {/* Breadcrumb 2 */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-border rounded"></div>
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span>Secret Detection</span>
          </div>
        </nav>

        {/* Breadcrumb 3 */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-border rounded"></div>
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span>License</span>
          </div>
        </nav>
      </div>

      <div className="border-t border-border pt-6">
        {/* Page Title */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl text-foreground">License</h1>
          <p className="text-muted-foreground">Choose and manage your project's open source license</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dependencies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md bg-muted">
            <TabsTrigger value="current" className="data-[state=active]:bg-background">Current</TabsTrigger>
            <TabsTrigger value="browse" className="data-[state=active]:bg-background">Browse</TabsTrigger>
            <TabsTrigger value="dependencies" className="data-[state=active]:bg-background">Dependencies</TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-background">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="dependencies" className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg text-foreground">License Dependencies</h2>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </div>

            <Card className="bg-card border border-border">
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="grid grid-cols-2 gap-4 p-4 border-b border-border bg-muted/50">
                  <div className="font-medium text-sm text-muted-foreground">Package</div>
                  <div className="font-medium text-sm text-muted-foreground">Version</div>
                </div>

                {/* Package Rows */}
                <div className="divide-y divide-border">
                  {licensePackages.map((pkg, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-4 hover:bg-muted/30 transition-colors">
                      <div className="text-sm text-card-foreground font-medium">{pkg.name}</div>
                      <div className="text-sm text-muted-foreground">{pkg.version}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="current">
            <Card className="bg-card border border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Current license information</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse">
            <Card className="bg-card border border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Browse available licenses for your project</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <Card className="bg-card border border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Take a quiz to find the right license for your project</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}